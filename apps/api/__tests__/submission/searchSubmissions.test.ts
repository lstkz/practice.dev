import { resetDb } from '../helper';
import { registerSampleUsers, addSampleTasks } from '../seed-data';
import { _putSubmission } from '../../src/contracts/submission/_putSubmission';
import { SubmissionStatus, Submission } from 'shared';
import { createKey } from '../../src/common/db';
import { searchSubmissions } from '../../src/contracts/submission/searchSubmissions';

beforeEach(async () => {
  await resetDb();
  await Promise.all([registerSampleUsers(), addSampleTasks()]);

  await Promise.all([
    _putSubmission(
      {
        ...createKey({ type: 'SUBMISSION', submissionId: 's1' }),
        submissionId: 's1',
        userId: '1',
        data_n: 1,
        challengeId: 1,
        testUrl: 'https://example.org',
        status: SubmissionStatus.Queued,
      },
      true
    ),
    _putSubmission(
      {
        ...createKey({ type: 'SUBMISSION', submissionId: 's2' }),
        submissionId: 's2',
        userId: '1',
        data_n: 3,
        challengeId: 1,
        testUrl: 'https://example.org',
        status: SubmissionStatus.Queued,
      },
      true
    ),
    _putSubmission(
      {
        ...createKey({ type: 'SUBMISSION', submissionId: 's3' }),
        submissionId: 's3',
        userId: '2',
        data_n: 2,
        challengeId: 2,
        testUrl: 'https://example.org',
        status: SubmissionStatus.Queued,
      },
      true
    ),
    _putSubmission(
      {
        ...createKey({ type: 'SUBMISSION', submissionId: 's3' }),
        submissionId: 's4',
        userId: '1',
        data_n: 4,
        challengeId: 2,
        testUrl: 'https://example.org',
        status: SubmissionStatus.Queued,
      },
      true
    ),
  ]);
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
