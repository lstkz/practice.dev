import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { doFn } from '../../common/helper';
import {
  SolutionEntity,
  UserUsernameEntity,
  UserEntity,
  SolutionVoteEntity,
} from '../../entities';
import { SearchResult } from '../../orm/types';
import { LoadMoreResult, Solution } from 'shared';
import { esSearch } from '../../common/elastic';

export const searchSolutions = createContract('solution.searchSolutions')
  .params('userId', 'criteria')
  .schema({
    userId: S.string().optional(),
    criteria: S.object().keys({
      challengeId: S.number().optional(),
      username: S.string().optional(),
      tags: S.array().items(S.string()).max(5).optional(),
      limit: S.pageSize(),
      cursor: S.string().optional().nullable(),
      sortBy: S.enum().values<'likes' | 'date'>(['likes', 'date']),
      sortDesc: S.boolean(),
    }),
  })
  .fn(async (userId, criteria) => {
    const { challengeId, username, tags, sortBy, sortDesc } = criteria;

    const { items, lastKey } = await doFn(async () => {
      const userId = username
        ? await UserUsernameEntity.getUserIdOrNull(username)
        : null;
      if (username && !userId) {
        return {
          items: [],
          lastKey: null,
        } as SearchResult<SolutionEntity>;
      }
      const esCriteria: any[] = [];
      if (challengeId) {
        esCriteria.push({
          match: { challengeId },
        });
      }
      if (userId) {
        esCriteria.push({
          match: { userId },
        });
      }
      if (tags && tags.length) {
        tags.forEach(tag => {
          esCriteria.push({
            term: {
              tags: tag,
            },
          });
        });
      }
      return await esSearch(SolutionEntity, {
        query: {
          bool: {
            must: esCriteria,
          },
        },
        sort: [
          {
            [sortBy === 'date' ? 'createdAt' : 'likes']: sortDesc
              ? 'desc'
              : 'asc',
          },
          {
            _id: 'asc',
          },
        ],
        limit: criteria.limit!,
        cursor: criteria.cursor,
      });
    });
    const [users, votes] = await Promise.all([
      UserEntity.getByIds(items.map(x => x.userId)),
      SolutionVoteEntity.getUserSolutionVotes(userId, items),
    ]);
    return {
      items: SolutionEntity.toSolutionMany(items, users, votes),
      cursor: lastKey,
    } as LoadMoreResult<Solution>;
  });

export const searchSolutionsRpc = createRpcBinding({
  public: true,
  injectUser: true,
  signature: 'solution.searchSolutions',
  handler: searchSolutions,
});
