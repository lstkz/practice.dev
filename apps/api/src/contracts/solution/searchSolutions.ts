import { SearchResult } from 'shared';
import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { UnreachableCaseError, AppError } from '../../common/errors';
import * as solutionReader from '../../readers/solutionReader';
import * as userReader from '../../readers/userReader';
import { doFn } from '../../common/helper';
import { SolutionEntity } from '../../entities';

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

    const { cursor, items } = await doFn(async () => {
      if (tags?.length && !challengeId) {
        throw new AppError(
          'Cannot search by tags if challengeId is not defined'
        );
      }
      if (!challengeId && !username) {
        throw new AppError('challengeId or username is required');
      }
      const userId = username
        ? await userReader.getIdByUsernameOrNull(username)
        : null;
      if (username && !userId) {
        return {
          items: [],
          cursor: null,
        } as SearchResult<SolutionEntity>;
      }
      const baseCriteria = {
        cursor: criteria.cursor,
        descending: sortDesc,
        limit: criteria.limit,
        sortBy,
      };
      if (tags?.length) {
        return solutionReader.searchByTags({
          ...baseCriteria,
          challengeId: challengeId!,
          userId,
          tags,
        });
      }
      if (userId && challengeId) {
        return solutionReader.searchByChallengeUser({
          ...baseCriteria,
          challengeId: challengeId,
          userId,
        });
      }
      if (userId) {
        return solutionReader.searchByUser({
          ...baseCriteria,
          userId,
        });
      }
      if (challengeId) {
        return solutionReader.searchByChallenge({
          ...baseCriteria,
          challengeId,
        });
      }
      throw new UnreachableCaseError('Unhandled query condition' as never);
    });

    const [users, votes] = await Promise.all([
      userReader.getByIds(items.map(x => x.userId)),
      solutionReader.getUserSolutionVotes(userId, items),
    ]);
    return {
      items: SolutionEntity.toSolutionMany(items, users, votes),
      cursor,
    };
  });

export const searchSolutionsRpc = createRpcBinding({
  public: true,
  injectUser: true,
  signature: 'solution.searchSolutions',
  handler: searchSolutions,
});
