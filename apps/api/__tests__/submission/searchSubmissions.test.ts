import { resetDb, esReIndexFromDynamo } from '../helper';
import { registerSampleUsers, addSampleChallenges } from '../seed-data';
import { SubmissionStatus, Submission } from 'shared';
import { searchSubmissions } from '../../src/contracts/submission/searchSubmissions';
import { SubmissionEntity } from '../../src/entities';
import { createSubmissionCUD } from '../../src/cud/submission';

beforeEach(async () => {
  await resetDb();
  await Promise.all([registerSampleUsers(), addSampleChallenges()]);

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
  ]);
  await esReIndexFromDynamo(SubmissionEntity.entityType);
});

function mapToTimestamps(items: Submission[]) {
  return items.map(item => new Date(item.createdAt).getTime());
}

it('search by challengeId', async () => {
  const { items } = await searchSubmissions({
    challengeId: 1,
    limit: 10,
  });

  expect(mapToTimestamps(items)).toEqual([3, 1]);
});

it('search by username', async () => {
  const { items } = await searchSubmissions({
    username: 'user2',
    limit: 10,
  });

  expect(mapToTimestamps(items)).toEqual([2]);
});

it('search by username and challengeId', async () => {
  const { items } = await searchSubmissions({
    username: 'user1',
    challengeId: 2,
    limit: 10,
  });

  expect(mapToTimestamps(items)).toEqual([4]);
});

it('should paginate properly', async () => {
  const ret = await searchSubmissions({
    challengeId: 1,
    limit: 1,
  });

  expect(mapToTimestamps(ret.items)).toEqual([3]);
  const ret2 = await searchSubmissions({
    challengeId: 1,
    limit: 1,
    cursor: ret.cursor,
  });
  expect(mapToTimestamps(ret2.items)).toEqual([1]);
});
