import { resetDb } from '../helper';
import { registerSampleUsers, addSampleChallenges } from '../seed-data';
import { SubmissionStatus, Submission } from 'shared';
import { searchSubmissions } from '../../src/contracts/submission/searchSubmissions';
import { SubmissionEntity } from '../../src/entities';
import { MockStream } from '../MockStream';

const mockStream = new MockStream();

beforeEach(async () => {
  await resetDb();
  await mockStream.init();
  await Promise.all([registerSampleUsers(), addSampleChallenges()]);

  const submissions = [
    new SubmissionEntity({
      submissionId: 's1',
      userId: '1',
      createdAt: 1,
      challengeId: 1,
      testUrl: 'https://example.org',
      status: SubmissionStatus.Queued,
    }),
    new SubmissionEntity({
      submissionId: 's2',
      userId: '1',
      createdAt: 3,
      challengeId: 1,
      testUrl: 'https://example.org',
      status: SubmissionStatus.Queued,
    }),
    new SubmissionEntity({
      submissionId: 's3',
      userId: '2',
      createdAt: 2,
      challengeId: 2,
      testUrl: 'https://example.org',
      status: SubmissionStatus.Queued,
    }),
    new SubmissionEntity({
      submissionId: 's4',
      userId: '1',
      createdAt: 4,
      challengeId: 2,
      testUrl: 'https://example.org',
      status: SubmissionStatus.Queued,
    }),
  ];
  await Promise.all(submissions.map(item => item.insert()));
  await mockStream.process();
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
