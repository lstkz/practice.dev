import * as R from 'remeda';
import { S } from 'schema';
import {
  createContract,
  getLoggedInUserOrAnonymous,
  createRpcBinding,
} from '../../lib';
import { createKey, queryMainIndexAll, queryIndexAll } from '../../common/db';
import { DbChallengeSolved, DbChallenge } from '../../types';
import { PagedResult, Challenge } from 'shared';
import { mapDbChallenge } from '../../common/mapping';

async function _getSolvedChallenges() {
  const user = getLoggedInUserOrAnonymous();
  if (!user) {
    return [];
  }
  const key = createKey({
    type: 'CHALLENGE_SOLVED',
    userId: user.userId,
    challengeId: -1,
  });
  const items = await queryMainIndexAll<DbChallengeSolved>({
    pk: key.pk,
  });

  return items.map(item => item.challengeId);
}

async function _getAllChallenges() {
  return await queryIndexAll<DbChallenge>({
    index: 'sk-data_n-index',
    sk: 'CHALLENGE',
  });
}

export const searchChallenges = createContract('challenge.searchChallenges')
  .params('criteria')
  .schema({
    criteria: S.object().keys({
      sortBy: S.enum()
        .literal('created', 'likes')
        .optional(),
      sortOrder: S.enum()
        .literal('desc', 'asc')
        .optional(),
      pageSize: S.pageSize(),
      pageNumber: S.pageNumber(),
      tags: S.array()
        .items(S.string())
        .optional(),
      domain: S.string().optional(),
      difficulty: S.string().optional(),
    }),
  })
  .fn(async criteria => {
    const { sortBy, sortOrder, tags, domain, difficulty } = criteria;
    const pageSize = criteria.pageSize!;
    const pageNumber = criteria.pageNumber!;

    const [items, solved] = await Promise.all([
      _getAllChallenges(),
      _getSolvedChallenges(),
    ]);

    const allChallenges = R.pipe(
      items,
      R.map(mapDbChallenge),
      R.filter(item => {
        if (domain) {
          if (item.domain !== domain) {
            return false;
          }
        }
        if (difficulty) {
          if (item.difficulty !== difficulty) {
            return false;
          }
        }
        if (tags) {
          if (R.intersection(tags, item.tags).length !== tags.length) {
            return false;
          }
        }
        return true;
      }),
      R.sort((a, b) => {
        const mul = sortOrder === 'desc' ? -1 : 1;
        if (sortBy === 'likes') {
          const diff = mul * (a.stats.likes - b.stats.likes);
          if (diff === 0) {
            return a.id - b.id;
          }
          return diff;
        }
        return mul * (a.id - b.id);
      })
    );

    const start = pageNumber * pageSize;
    const paginated = allChallenges.slice(start, start + pageSize);

    const solvedMap = R.indexBy(solved, x => x);
    paginated.forEach(item => {
      if (solvedMap[item.id]) {
        item.isSolved = true;
      }
    });

    const total = allChallenges.length;
    const result: PagedResult<Challenge> = {
      total,
      pageSize,
      pageNumber,
      totalPages: Math.ceil(total / pageSize),
      items: paginated,
    };
    return result;
  });

export const searchChallengesRpc = createRpcBinding({
  public: true,
  signature: 'challenge.searchChallenges',
  handler: searchChallenges,
});
