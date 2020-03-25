import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
import * as challengeReader from '../../readers/challengeReader';
import { AppError } from '../../common/errors';

export const getChallengeById = createContract('challenge.getChallengeById')
  .params('userId', 'id')
  .schema({
    userId: S.string().optional(),
    id: S.number(),
  })
  .fn(async (userId, id) => {
    const [challenge, isSolved] = await Promise.all([
      challengeReader.getChallengeByIdOrNull(id),
      challengeReader.getIsSolved(userId, id),
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
