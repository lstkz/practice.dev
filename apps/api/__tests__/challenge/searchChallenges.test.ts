import { resetDb, setChallengeStats } from '../helper';
import { updateChallenge } from '../../src/contracts/challenge/updateChallenge';
import { registerSampleUsers } from '../seed-data';
import { searchChallenges } from '../../src/contracts/challenge/searchChallenges';
import { PagedResult, Challenge } from 'shared';
import { markSolved } from '../../src/contracts/challenge/markSolved';
import { DbUser } from '../../src/types';
import { getDbUserByToken } from '../../src/contracts/user/getDbUserByToken';
import { runWithContext } from '../../src/lib';

let user: DbUser | null;

beforeEach(async () => {
  await resetDb();
  await Promise.all([registerSampleUsers(), insertSampleData()]);
  user = await getDbUserByToken('user1_token');
});

async function insertSampleData() {
  await Promise.all([
    updateChallenge({
      id: 1,
      title: 'c1',
      description: 'd1',
      bundle: 'http://example.org',
      tests: 'http://example.org/tests',
      domain: 'frontend',
      difficulty: 'easy',
      tags: ['foo'],
    }),
    updateChallenge({
      id: 2,
      title: 'c2',
      description: 'd2',
      bundle: 'http://example.org',
      tests: 'http://example.org/tests',
      domain: 'frontend',
      difficulty: 'easy',
      tags: ['bar'],
    }),
    updateChallenge({
      id: 3,
      title: 'c3',
      description: 'd3',
      bundle: 'http://example.org',
      tests: 'http://example.org/tests',
      domain: 'frontend',
      difficulty: 'hard',
      tags: ['foo', 'bar'],
    }),
    updateChallenge({
      id: 4,
      title: 'c4',
      description: 'd4',
      bundle: 'http://example.org',
      tests: 'http://example.org/tests',
      domain: 'backend',
      difficulty: 'easy',
      tags: ['foo'],
    }),
  ]);

  // update stats
  await setChallengeStats(2, {
    submissions: 0,
    solutions: 0,
    solved: 0,
    likes: 10,
  });
}

function fixResponse(result: PagedResult<Challenge>) {
  return {
    ...result,
    items: result.items.map(x => x.id),
  };
}

it('should return all challenges', async () => {
  await runWithContext(
    {
      user,
    },
    async () => {
      const result = await searchChallenges({});
      expect(fixResponse(result)).toEqual({
        items: [1, 2, 3, 4],
        pageNumber: 0,
        pageSize: 30,
        total: 4,
        totalPages: 1,
      });
    }
  );
});

it('should return all challenges DESC', async () => {
  await runWithContext(
    {
      user,
    },
    async () => {
      const result = await searchChallenges({
        sortOrder: 'desc',
      });
      expect(fixResponse(result)).toEqual({
        items: [4, 3, 2, 1],
        pageNumber: 0,
        pageSize: 30,
        total: 4,
        totalPages: 1,
      });
    }
  );
});

it('sort by likes', async () => {
  await runWithContext(
    {
      user,
    },
    async () => {
      const result = await searchChallenges({
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
    }
  );
});

it('should return all challenges with pagination', async () => {
  await runWithContext(
    {
      user,
    },
    async () => {
      const result = await searchChallenges({
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
    }
  );
});

it('filter by domain', async () => {
  await runWithContext(
    {
      user,
    },
    async () => {
      const result = await searchChallenges({
        domain: 'frontend',
      });
      expect(fixResponse(result)).toEqual({
        items: [1, 2, 3],
        pageNumber: 0,
        pageSize: 30,
        total: 3,
        totalPages: 1,
      });
    }
  );
});
it('filter by difficulty', async () => {
  await runWithContext(
    {
      user,
    },
    async () => {
      const result = await searchChallenges({
        difficulty: 'easy',
      });
      expect(fixResponse(result)).toEqual({
        items: [1, 2, 4],
        pageNumber: 0,
        pageSize: 30,
        total: 3,
        totalPages: 1,
      });
    }
  );
});

it('filter by one tag', async () => {
  await runWithContext(
    {
      user,
    },
    async () => {
      const result = await searchChallenges({
        tags: ['foo'],
      });
      expect(fixResponse(result)).toEqual({
        items: [1, 3, 4],
        pageNumber: 0,
        pageSize: 30,
        total: 3,
        totalPages: 1,
      });
    }
  );
});

it('filter by two tags', async () => {
  await runWithContext(
    {
      user,
    },
    async () => {
      const result = await searchChallenges({
        tags: ['foo', 'bar'],
      });
      expect(fixResponse(result)).toEqual({
        items: [3],
        pageNumber: 0,
        pageSize: 30,
        total: 1,
        totalPages: 1,
      });
    }
  );
});

it('with solved', async () => {
  await runWithContext(
    {
      user,
    },
    async () => {
      await markSolved({
        challengeId: 1,
        solvedAt: 1,
        userId: '1',
      });
      const ret = await searchChallenges({
        pageNumber: 0,
        pageSize: 2,
        sortBy: 'created',
        sortOrder: 'asc',
      });

      expect(ret.items[0].id).toEqual(1);
      expect(ret.items[0].isSolved).toEqual(true);
      expect(ret.items[1].id).toEqual(2);
      expect(ret.items[1].isSolved).toEqual(false);
    }
  );
});
