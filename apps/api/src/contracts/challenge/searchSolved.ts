import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
import { AppError } from '../../common/errors';
import { doFn } from '../../common/helper';
import * as challengeReader from '../../readers/challengeReader';
import * as userReader from '../../readers/userReader';
import { SearchResult } from 'shared';
import { ChallengeSolvedEntity } from '../../entities';

export const searchSolved = createContract('challenge.searchSolved')
  .params('criteria')
  .schema({
    criteria: S.object().keys({
      challengeId: S.number().optional(),
      username: S.string().optional(),
      limit: S.pageSize(),
      cursor: S.string().optional(),
    }),
  })
  .fn(async criteria => {
    const { challengeId, username } = criteria;
    if (!challengeId && !username) {
      throw new AppError('challengeId or username must be defined');
    }
    const { cursor, items } = await doFn(async () => {
      const baseCriteria = {
        limit: criteria.limit,
        descending: true,
        cursor: criteria.cursor,
      };
      if (username) {
        const userId = await userReader.getIdByUsernameOrNull(username);
        if (!userId) {
          return {
            items: [],
            cursor: null,
          } as SearchResult<ChallengeSolvedEntity>;
        }
        return challengeReader.searchSolvedByUserId({
          ...baseCriteria,
          userId,
        });
      }
      if (challengeId) {
        return challengeReader.searchSolvedByChallengeId({
          ...baseCriteria,
          challengeId,
        });
      }
      throw new AppError('challengeId or username must be defined');
    });
    const users = await userReader.getByIds(items.map(x => x.userId));
    return {
      items: ChallengeSolvedEntity.toChallengeSolvedMany(items, users),
      cursor: cursor,
    };
  });

export const searchSolvedRpc = createRpcBinding({
  public: true,
  signature: 'challenge.searchSolved',
  handler: searchSolved,
});
