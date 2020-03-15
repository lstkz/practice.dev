import * as R from 'remeda';
import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { createKey, queryMainIndexAll, queryIndexAll } from '../../common/db';
import { DbChallengeSolved, DbChallenge } from '../../types';
import { PagedResult, Challenge } from 'shared';
import { mapDbChallenge } from '../../common/mapping';

async function _getSolvedChallenges(userId: string | undefined) {
  if (!userId) {
    return [];
  }
  const key = createKey({
    type: 'CHALLENGE_SOLVED',
    userId: userId,
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
  .params('userId', 'criteria')
  .schema({
    userId: S.string().optional(),
    criteria: S.object().keys({
      sortBy: S.enum()
        .literal('created', 'likes', 'solved', 'submissions')
        .optional(),
      sortOrder: S.enum()
        .literal('desc', 'asc')
        .optional(),
      pageSize: S.pageSize(),
      pageNumber: S.pageNumber(),
      tags: S.array()
        .items(S.string())
        .optional(),
      domains: S.array()
        .items(S.string())
        .optional(),
      difficulties: S.array()
        .items(S.string())
        .optional(),
      statuses: S.array()
        .items(S.enum().literal('solved', 'unsolved'))
        .optional(),
    }),
  })
  .fn(async (userId, criteria) => {
    const {
      sortBy,
      sortOrder,
      tags,
      domains,
      difficulties,
      statuses,
    } = criteria;
    const pageSize = criteria.pageSize!;
    const pageNumber = criteria.pageNumber!;

    const [items, solved] = await Promise.all([
      _getAllChallenges(),
      _getSolvedChallenges(userId),
    ]);

    const solvedMap = R.indexBy(solved, x => x);

    const allChallenges = R.pipe(
      items,
      R.map(item => {
        const mapped = mapDbChallenge(item);
        if (solvedMap[mapped.id]) {
          mapped.isSolved = true;
        }
        return mapped;
      }),
      R.filter(item => {
        if (domains && domains.length) {
          if (!domains.includes(item.domain)) {
            return false;
          }
        }
        if (difficulties && difficulties.length) {
          if (!difficulties.includes(item.difficulty)) {
            return false;
          }
        }
        if (tags) {
          if (R.intersection(tags, item.tags).length !== tags.length) {
            return false;
          }
        }
        if (statuses && statuses.length) {
          if (item.isSolved && !statuses.some(x => x === 'solved')) {
            return false;
          }
          if (!item.isSolved && !statuses.some(x => x === 'unsolved')) {
            return false;
          }
        }
        return true;
      }),
      R.sort((a, b) => {
        const mul = sortOrder === 'desc' ? -1 : 1;
        if (sortBy && sortBy !== 'created') {
          const diff = mul * (a.stats[sortBy] - b.stats[sortBy]);
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
  injectUser: true,
  public: true,
  signature: 'challenge.searchChallenges',
  handler: searchChallenges,
});
