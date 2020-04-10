import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
import { AppError } from '../../common/errors';
import { ChallengeEntity, ChallengeSolvedEntity } from '../../entities';

export const getChallengeById = createContract('challenge.getChallengeById')
  .params('userId', 'id')
  .schema({
    userId: S.string().optional(),
    id: S.number(),
  })
  .fn(async (userId, id) => {
    const [challenge, isSolved] = await Promise.all([
      ChallengeEntity.getByKeyOrNull({ challengeId: id }),
      ChallengeSolvedEntity.getIsSolved(userId, id),
    ]);
    if (!challenge) {
      throw new AppError('Challenge not found');
    }
    return challenge.toChallenge(isSolved!);
  });

export const getChallengeByIdRpc = createRpcBinding({
  injectUser: true,
  public: true,
  signature: 'challenge.getChallengeById',
  handler: getChallengeById,
});
