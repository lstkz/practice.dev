import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
import { createKey, getItem } from '../../common/db';
import { DbChallengeSolved } from '../../types';
import { mapDbChallenge } from '../../common/mapping';
import { getDbChallengeById } from './getDbChallengeById';

async function getIsSolved(userId: string | undefined, challengeId: number) {
  if (!userId) {
    return false;
  }
  const key = createKey({
    type: 'CHALLENGE_SOLVED',
    challengeId,
    userId: userId,
  });
  const solved = await getItem<DbChallengeSolved>(key);
  return solved != null;
}

export const getChallengeById = createContract('challenge.getChallengeById')
  .params('userId', 'id')
  .schema({
    userId: S.string().optional(),
    id: S.number(),
  })
  .fn(async (userId, id) => {
    const [dbChallenge, isSolved] = await Promise.all([
      getDbChallengeById(id),
      getIsSolved(userId, id),
    ]);
    return mapDbChallenge(dbChallenge, isSolved);
  });

export const getChallengeByIdRpc = createRpcBinding({
  injectUser: true,
  public: true,
  signature: 'challenge.getChallengeById',
  handler: getChallengeById,
});
