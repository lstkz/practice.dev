import * as R from 'remeda';
import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
import { AppError } from '../../common/errors';
import { doFn, decLastKey, encLastKey } from '../../common/helper';
import { SearchResult, BaseSearchCriteria } from '../../orm/types';
import {
  UserUsernameEntity,
  UserEntity,
  ChallengeSolvedEntity,
} from '../../entities2';

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
    const { lastKey, items } = await doFn(async () => {
      const baseCriteria: BaseSearchCriteria = {
        limit: criteria.limit,
        sort: 'desc',
        lastKey: decLastKey(criteria.cursor),
      };
      if (username) {
        const userId = await UserUsernameEntity.getByKeyOrNull({
          username,
        }).then(x => x?.userId);
        if (!userId) {
          return {
            items: [],
            lastKey: null,
          } as SearchResult<ChallengeSolvedEntity>;
        }
        return ChallengeSolvedEntity.searchSolvedByUserId({
          ...baseCriteria,
          userId,
        });
      }
      if (challengeId) {
        return ChallengeSolvedEntity.searchSolvedByChallengeId({
          ...baseCriteria,
          challengeId,
        });
      }
      throw new AppError('challengeId or username must be defined');
    });
    const users = await UserEntity.batchGet(
      items.map(x => R.pick(x, ['userId']))
    );
    return {
      items: ChallengeSolvedEntity.toChallengeSolvedMany(items, users),
      cursor: encLastKey(lastKey),
    };
  });

export const searchSolvedRpc = createRpcBinding({
  public: true,
  signature: 'challenge.searchSolved',
  handler: searchSolved,
});
