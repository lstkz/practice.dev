import { resetDb, esReIndexFromDynamo } from '../helper';
import {
  registerSampleUsers,
  addSampleChallenges,
  addSampleProjects,
} from '../seed-data';
import { SubmissionStatus, Submission } from 'shared';
import { searchSubmissions } from '../../src/contracts/submission/searchSubmissions';
import { SubmissionEntity } from '../../src/entities';
import { createSubmissionCUD } from '../../src/cud/submission';
import { createProjectChallengeSolvedCUD } from '../../src/cud/projectChallengeSolved';

beforeEach(async () => {
  await resetDb();
  await Promise.all([
    registerSampleUsers(),
    addSampleChallenges(),
    addSampleProjects(),
  ]);

  await Promise.all([
    createSubmissionCUD({
      submissionId: 's1',
      userId: '1',
      createdAt: 1,
      challengeId: 1,
      testUrl: 'https://example.org',
      status: SubmissionStatus.Queued,
      type: 'challenge',
    }),
    createSubmissionCUD({
      submissionId: 's2',
      userId: '1',
      createdAt: 3,
      challengeId: 1,
      testUrl: 'https://example.org',
      status: SubmissionStatus.Queued,
      type: 'challenge',
    }),
    createSubmissionCUD({
      submissionId: 's3',
      userId: '2',
      createdAt: 2,
      challengeId: 2,
      testUrl: 'https://example.org',
      status: SubmissionStatus.Queued,
      type: 'challenge',
    }),
    createSubmissionCUD({
      submissionId: 's4',
      userId: '1',
      createdAt: 4,
      challengeId: 2,
      testUrl: 'https://example.org',
      status: SubmissionStatus.Queued,
      type: 'challenge',
    }),
    createSubmissionCUD({
      submissionId: 's5',
      userId: '1',
      createdAt: 5,
      challengeId: 1,
      projectId: 1,
      testUrl: 'https://example.org',
      status: SubmissionStatus.Queued,
      type: 'project',
    }),
    createSubmissionCUD({
      submissionId: 's6',
      userId: '1',
      createdAt: 6,
      challengeId: 2,
      projectId: 1,
      testUrl: 'https://example.org',
      status: SubmissionStatus.Queued,
      type: 'project',
    }),
  ]);
  await esReIndexFromDynamo(SubmissionEntity.entityType);
});

function mapToTimestamps(items: Submission[]) {
  return items.map(item => new Date(item.createdAt).getTime());
}

it('search by challengeId', async () => {
  const { items } = await searchSubmissions(undefined, {
    challengeId: 1,
    limit: 10,
  });

  expect(mapToTimestamps(items)).toEqual([3, 1]);
});

it('search by username', async () => {
  const { items } = await searchSubmissions(undefined, {
    username: 'user2',
    limit: 10,
  });

  expect(mapToTimestamps(items)).toEqual([2]);
});

it('search by username and challengeId', async () => {
  const { items } = await searchSubmissions(undefined, {
    username: 'user1',
    challengeId: 2,
    limit: 10,
  });

  expect(mapToTimestamps(items)).toEqual([4]);
});

it('should paginate properly', async () => {
  const ret = await searchSubmissions(undefined, {
    challengeId: 1,
    limit: 1,
  });

  expect(mapToTimestamps(ret.items)).toEqual([3]);
  const ret2 = await searchSubmissions(undefined, {
    challengeId: 1,
    limit: 1,
    cursor: ret.cursor,
  });
  expect(mapToTimestamps(ret2.items)).toEqual([1]);
});

it('should throw an error if challengeId is missing and projectId is defined', async () => {
  await expect(
    searchSubmissions(undefined, {
      projectId: 1,
    })
  ).rejects.toThrow('challengeId is required if projectId is defined');
});

it('should throw an error if permission for project', async () => {
  await expect(
    searchSubmissions(undefined, {
      projectId: 1,
      challengeId: 3,
    })
  ).rejects.toThrow(
    "You don't have permission to access the provided Project Challenge."
  );
  await expect(
    searchSubmissions('1', {
      projectId: 1,
      challengeId: 3,
    })
  ).rejects.toThrow(
    "You don't have permission to access the provided Project Challenge."
  );
});

it('should search project challenges (first challenge)', async () => {
  const { items } = await searchSubmissions(undefined, {
    projectId: 1,
    challengeId: 1,
  });

  expect(mapToTimestamps(items)).toEqual([5]);
});

it('should search project challenges (solved challenge)', async () => {
  await createProjectChallengeSolvedCUD({
    challengeId: 1,
    projectId: 1,
    solvedAt: 1,
    userId: '1',
  });
  const { items } = await searchSubmissions('1', {
    projectId: 1,
    challengeId: 2,
  });

  expect(mapToTimestamps(items)).toEqual([6]);
});
