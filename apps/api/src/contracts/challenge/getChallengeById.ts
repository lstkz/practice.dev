import {
  createContract,
  getLoggedInUserOrAnonymous,
  createRpcBinding,
} from '../../lib';
import { S } from 'schema';
import { createKey, getItem } from '../../common/db';
import { DbChallengeSolved } from '../../types';
import { mapDbChallenge } from '../../common/mapping';
import { getDbChallengeById } from './getDbChallengeById';

async function getIsSolved(challengeId: number) {
  const user = getLoggedInUserOrAnonymous();
  if (!user) {
    return false;
  }
  const key = createKey({
    type: 'CHALLENGE_SOLVED',
    challengeId,
    userId: user.userId,
  });
  const solved = await getItem<DbChallengeSolved>(key);
  return solved != null;
}

export const getChallengeById = createContract('challenge.getChallengeById')
  .params('id')
  .schema({
    id: S.number(),
  })
  .fn(async id => {
    const [dbChallenge, isSolved] = await Promise.all([
      getDbChallengeById(id),
      getIsSolved(id),
    ]);
    return mapDbChallenge(dbChallenge, isSolved);
  });

export const getChallengeByIdRpc = createRpcBinding({
  public: true,
  signature: 'challenge.getChallengeById',
  handler: getChallengeById,
});
