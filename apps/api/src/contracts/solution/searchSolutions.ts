import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { UnreachableCaseError, AppError } from '../../common/errors';
import { doFn, decLastKey, encLastKey } from '../../common/helper';
import {
  SolutionEntity,
  UserUsernameEntity,
  BaseSolutionSearchCriteria,
  UserEntity,
  SolutionVoteEntity,
} from '../../entities2';
import { SearchResult } from '../../orm/types';

export const searchSolutions = createContract('solution.searchSolutions')
  .params('userId', 'criteria')
  .schema({
    userId: S.string().optional(),
    criteria: S.object().keys({
      challengeId: S.number().optional(),
      username: S.string().optional(),
      tags: S.array()
        .items(S.string())
        .max(5)
        .optional(),
      limit: S.pageSize(),
      cursor: S.string()
        .optional()
        .nullable(),
      sortBy: S.enum().values<'likes' | 'date'>(['likes', 'date']),
      sortDesc: S.boolean(),
    }),
  })
  .fn(async (userId, criteria) => {
    const { challengeId, username, tags, sortBy, sortDesc } = criteria;

    const { items, lastKey } = await doFn(async () => {
      if (tags?.length && !challengeId) {
        throw new AppError(
          'Cannot search by tags if challengeId is not defined'
        );
      }
      if (!challengeId && !username) {
        throw new AppError('challengeId or username is required');
      }
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
      const baseCriteria: BaseSolutionSearchCriteria = {
        lastKey: decLastKey(criteria.cursor),
        sort: sortDesc ? 'desc' : 'asc',
        limit: criteria.limit!,
        sortBy,
      };
      if (tags?.length) {
        return SolutionEntity.searchByTags({
          ...baseCriteria,
          challengeId: challengeId!,
          userId,
          tags,
        });
      }
      if (userId && challengeId) {
        return SolutionEntity.searchByChallengeUser({
          ...baseCriteria,
          challengeId: challengeId,
          userId,
        });
      }
      if (userId) {
        return SolutionEntity.searchByUser({
          ...baseCriteria,
          userId,
        });
      }
      if (challengeId) {
        return SolutionEntity.searchByChallenge({
          ...baseCriteria,
          challengeId,
        });
      }
      throw new UnreachableCaseError('Unhandled query condition' as never);
    });

    const [users, votes] = await Promise.all([
      UserEntity.getByIds(items.map(x => x.userId)),
      SolutionVoteEntity.getUserSolutionVotes(userId, items),
    ]);
    return {
      items: SolutionEntity.toSolutionMany(items, users, votes),
      cursor: encLastKey(lastKey),
    };
  });

export const searchSolutionsRpc = createRpcBinding({
  public: true,
  injectUser: true,
  signature: 'solution.searchSolutions',
  handler: searchSolutions,
});
