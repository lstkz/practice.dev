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

export const searchLikesSolutions = createContract(
  'solution.searchLikesSolutions'
)
  .params('userId', 'criteria')
  .schema({
    userId: S.string().optional(),
    criteria: S.object().keys({
      username: S.string(),
      limit: S.pageSize(),
      cursor: S.string().optional().nullable(),
    }),
  })
  .fn(async (userId, criteria) => {
    const { username } = criteria;
    const { items, lastKey } = await doFn(async () => {
      const userId = await UserUsernameEntity.getUserIdOrNull(username);
      if (!userId) {
        return {
          items: [],
          lastKey: null,
        } as SearchResult<SolutionEntity>;
      }
      const esCriteria: any[] = [
        {
          match: { userId },
        },
      ];
      const esResult = await esSearch(SolutionVoteEntity, {
        query: {
          bool: {
            must: esCriteria,
          },
        },
        sort: [
          {
            data_n: 'desc',
          },
          {
            _id: 'asc',
          },
        ],
        limit: criteria.limit!,
        cursor: criteria.cursor,
      });
      const items = await SolutionEntity.batchGet(esResult.items);
      items.sort((a, b) => b.createdAt - a.createdAt);
      return { items, lastKey: esResult.lastKey };
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
  signature: 'solution.searchLikesSolutions',
  handler: searchLikesSolutions,
});
