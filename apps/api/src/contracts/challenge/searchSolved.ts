import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
// import { AppError } from '../../common/errors';
// import { doFn, decLastKey, encLastKey } from '../../common/helper';
// import { SearchResult, BaseSearchCriteria } from '../../orm/types';
// import {
//   UserUsernameEntity,
//   UserEntity,
//   ChallengeSolvedEntity,
// } from '../../entities';
// import { Challenge, LoadMoreResult, ChallengeSolved } from 'shared';

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
  .fn(async () => {
    throw new Error('todo');
    // const { challengeId, username } = criteria;
    // if (!challengeId && !username) {
    //   throw new AppError('challengeId or username must be defined');
    // }
    // const { lastKey, items } = await doFn(async () => {
    //   const baseCriteria: BaseSearchCriteria = {
    //     limit: criteria.limit,
    //     sort: 'desc',
    //     lastKey: decLastKey(criteria.cursor),
    //   };
    //   if (username) {
    //     const userId = await UserUsernameEntity.getUserIdOrNull(username);
    //     if (!userId) {
    //       return {
    //         items: [],
    //         lastKey: null,
    //       } as SearchResult<ChallengeSolvedEntity>;
    //     }
    //     return ChallengeSolvedEntity.searchSolvedByUserId({
    //       ...baseCriteria,
    //       userId,
    //     });
    //   }
    //   if (challengeId) {
    //     return ChallengeSolvedEntity.searchSolvedByChallengeId({
    //       ...baseCriteria,
    //       challengeId,
    //     });
    //   }
    //   throw new AppError('challengeId or username must be defined');
    // });
    // const users = await UserEntity.getByIds(items.map(x => x.userId));
    // return {
    //   items: ChallengeSolvedEntity.toChallengeSolvedMany(items, users),
    //   cursor: encLastKey(lastKey),
    // } as LoadMoreResult<ChallengeSolved>;
  });

export const searchSolvedRpc = createRpcBinding({
  public: true,
  signature: 'challenge.searchSolved',
  handler: searchSolved,
});
