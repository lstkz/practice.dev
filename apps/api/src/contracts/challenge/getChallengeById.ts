import { createContract, getLoggedInUserOrAnonymous } from '../../lib';
import { S } from 'schema';
import { AppError } from '../../common/errors';
import { createKey, getItem } from '../../common/db';
import { DbChallengeSolved, DbChallenge } from '../../types';
import { mapDbChallenge } from '../../common/mapping';

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
    const challengeKey = createKey({ type: 'CHALLENGE', id });
    const [dbChallenge, isSolved] = await Promise.all([
      getItem<DbChallenge>(challengeKey),
      getIsSolved(id),
    ]);
    if (!dbChallenge) {
      throw new AppError(`Challenge "${id}" does not exist`);
    }
    return mapDbChallenge(dbChallenge, isSolved);
  });
