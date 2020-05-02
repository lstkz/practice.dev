import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { UnreachableCaseError, AppError } from '../../common/errors';
import { doFn, decLastKey, encLastKey } from '../../common/helper';
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
        ? await UserUsernameEntity.getByKeyOrNull({ username }).then(
            x => x?.userId
          )
        : null;
      if (username && !userId) {
        return {
          items: [],
          lastKey: null,
        } as SearchResult<SolutionEntity>;
      }
      const criteria: any[] = [];
      if (challengeId) {
        criteria.push({
          match: { challengeId },
        });
      }
      if (userId) {
        criteria.push({
          match: { userId },
        });
      }
      let terms = undefined;
      if (tags && tags.length) {
        // terms = {
        //   tags: tags,
        //   // minimum_should_match: 1,
        // };
        tags.forEach(tag => {
          criteria.push({
            term: {
              tags: tag,
            },
          });
        });
        // criteria.push({
        //   terms: {
        //     tags: tags,
        //     execution: 'and',
        //   },
        // });
      }
      const ret: any = await esSearch('solution', {
        query: {
          // filter: {
          //   terms,
          // },
          bool: {
            must: criteria,
          },
        },
      });
      console.log(ret);
      const items: SolutionEntity[] = ret.hits.hits.map(
        x => new SolutionEntity(x._source)
      );
      return {
        items,
        lastKey: null,
      };
    });

    // const { items, lastKey } = await doFn(async () => {
    //   if (tags?.length && !challengeId) {
    //     throw new AppError(
    //       'Cannot search by tags if challengeId is not defined'
    //     );
    //   }
    //   if (!challengeId && !username) {
    //     throw new AppError('challengeId or username is required');
    //   }
    //   const userId = username
    //     ? await UserUsernameEntity.getByKeyOrNull({ username }).then(
    //         x => x?.userId
    //       )
    //     : null;
    //   if (username && !userId) {
    //     return {
    //       items: [],
    //       lastKey: null,
    //     } as SearchResult<SolutionEntity>;
    //   }
    //   const baseCriteria: BaseSolutionSearchCriteria = {
    //     lastKey: decLastKey(criteria.cursor),
    //     sort: sortDesc ? 'desc' : 'asc',
    //     limit: criteria.limit!,
    //     sortBy,
    //   };
    //   if (tags?.length) {
    //     return SolutionEntity.searchByTags({
    //       ...baseCriteria,
    //       challengeId: challengeId!,
    //       userId,
    //       tags,
    //     });
    //   }
    //   if (userId && challengeId) {
    //     return SolutionEntity.searchByChallengeUser({
    //       ...baseCriteria,
    //       challengeId: challengeId,
    //       userId,
    //     });
    //   }
    //   if (userId) {
    //     return SolutionEntity.searchByUser({
    //       ...baseCriteria,
    //       userId,
    //     });
    //   }
    //   if (challengeId) {
    //     return SolutionEntity.searchByChallenge({
    //       ...baseCriteria,
    //       challengeId,
    //     });
    //   }
    //   throw new UnreachableCaseError('Unhandled query condition' as never);
    // });

    const [users, votes] = await Promise.all([
      UserEntity.getByIds(items.map(x => x.userId)),
      SolutionVoteEntity.getUserSolutionVotes(userId, items),
    ]);
    return {
      items: SolutionEntity.toSolutionMany(items, users, votes),
      cursor: encLastKey(lastKey),
    } as LoadMoreResult<Solution>;
  });

export const searchSolutionsRpc = createRpcBinding({
  public: true,
  injectUser: true,
  signature: 'solution.searchSolutions',
  handler: searchSolutions,
});
