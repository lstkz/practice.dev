import { resetDb, setChallengeStats } from '../helper';
import { updateChallenge } from '../../src/contracts/challenge/updateChallenge';
import { registerSampleUsers } from '../seed-data';
import { searchChallenges } from '../../src/contracts/challenge/searchChallenges';
import { PagedResult, Challenge } from 'shared';
import { createChallengeSolvedCUD } from '../../src/cud/challengeSolved';

const userId = '1';

beforeEach(async () => {
  await resetDb();
  await Promise.all([registerSampleUsers(), insertSampleData()]);
});

async function insertSampleData() {
  await Promise.all([
    updateChallenge({
      id: 1,
      title: 'c1',
      description: 'd1',
      detailsBundleS3Key: 'http://example.org',
      testsBundleS3Key: 'http://example.org/testsBundleS3Key',
      domain: 'frontend',
      difficulty: 'easy',
      tags: ['foo'],
      testCase: 'a',
    }),
    updateChallenge({
      id: 2,
      title: 'c2',
      description: 'd2',
      detailsBundleS3Key: 'http://example.org',
      testsBundleS3Key: 'http://example.org/testsBundleS3Key',
      domain: 'frontend',
      difficulty: 'easy',
      tags: ['bar'],
      testCase: 'a',
    }),
    updateChallenge({
      id: 3,
      title: 'c3',
      description: 'd3',
      detailsBundleS3Key: 'http://example.org',
      testsBundleS3Key: 'http://example.org/testsBundleS3Key',
      domain: 'frontend',
      difficulty: 'hard',
      tags: ['foo', 'bar'],
      testCase: 'a',
    }),
    updateChallenge({
      id: 4,
      title: 'c4',
      description: 'd4',
      detailsBundleS3Key: 'http://example.org',
      testsBundleS3Key: 'http://example.org/testsBundleS3Key',
      domain: 'backend',
      difficulty: 'easy',
      tags: ['foo'],
      testCase: 'a',
    }),
  ]);

  // update stats
  await setChallengeStats(2, {
    submissions: 0,
    solutions: 0,
    solved: 0,
    likes: 10,
  });

  await createChallengeSolvedCUD({
    userId: '1',
    challengeId: 2,
    solvedAt: 1,
  });
}

function fixResponse(result: PagedResult<Challenge>) {
  return {
    ...result,
    items: result.items.map(x => x.id),
  };
}

it('should return all challenges', async () => {
  const result = await searchChallenges(userId, {});
  expect(fixResponse(result)).toEqual({
    items: [1, 2, 3, 4],
    pageNumber: 0,
    pageSize: 30,
    total: 4,
    totalPages: 1,
  });
});

it('should return all challenges DESC', async () => {
  const result = await searchChallenges(userId, {
    sortOrder: 'desc',
  });
  expect(fixResponse(result)).toEqual({
    items: [4, 3, 2, 1],
    pageNumber: 0,
    pageSize: 30,
    total: 4,
    totalPages: 1,
  });
});

it('sort by likes', async () => {
  const result = await searchChallenges(userId, {
    sortBy: 'likes',
    sortOrder: 'desc',
  });
  expect(fixResponse(result)).toEqual({
    items: [2, 1, 3, 4],
    pageNumber: 0,
    pageSize: 30,
    total: 4,
    totalPages: 1,
  });
});

it('should return all challenges with pagination', async () => {
  const result = await searchChallenges(userId, {
    pageSize: 1,
    pageNumber: 1,
  });
  expect(fixResponse(result)).toEqual({
    items: [2],
    pageNumber: 1,
    pageSize: 1,
    total: 4,
    totalPages: 4,
  });
});

it('filter by solved', async () => {
  const result = await searchChallenges(userId, {
    statuses: ['solved'],
  });
  expect(fixResponse(result)).toEqual({
    items: [2],
    pageNumber: 0,
    pageSize: 30,
    total: 1,
    totalPages: 1,
  });
  expect(result.items[0].isSolved).toEqual(true);
});

it('filter by unsolved', async () => {
  const result = await searchChallenges(userId, {
    statuses: ['unsolved'],
  });
  expect(fixResponse(result)).toEqual({
    items: [1, 3, 4],
    pageNumber: 0,
    pageSize: 30,
    total: 3,
    totalPages: 1,
  });
});

it('filter by domain', async () => {
  const result = await searchChallenges(userId, {
    domains: ['frontend'],
  });
  expect(fixResponse(result)).toEqual({
    items: [1, 2, 3],
    pageNumber: 0,
    pageSize: 30,
    total: 3,
    totalPages: 1,
  });
});

it('filter by difficulty', async () => {
  const result = await searchChallenges(userId, {
    difficulties: ['easy'],
  });
  expect(fixResponse(result)).toEqual({
    items: [1, 2, 4],
    pageNumber: 0,
    pageSize: 30,
    total: 3,
    totalPages: 1,
  });
});

it('filter by one tag', async () => {
  const result = await searchChallenges(userId, {
    tags: ['foo'],
  });
  expect(fixResponse(result)).toEqual({
    items: [1, 3, 4],
    pageNumber: 0,
    pageSize: 30,
    total: 3,
    totalPages: 1,
  });
});

it('filter by two tags', async () => {
  const result = await searchChallenges(userId, {
    tags: ['foo', 'bar'],
  });
  expect(fixResponse(result)).toEqual({
    items: [3],
    pageNumber: 0,
    pageSize: 30,
    total: 1,
    totalPages: 1,
  });
});
