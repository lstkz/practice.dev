import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
import { getChallengeById } from '../challenge/getChallengeById';
import { createKey, getItem } from '../../common/db';
import { DbChallengeSolved } from '../../types';
import { AppError } from '../../common/errors';
import uuid from 'uuid';
import { _createSolution } from './_createSolution';
import { mapDbSolution } from '../../common/mapping';
// import { getDbUserById } from '../user/getDbUserById';
import { solutionUserInput } from './_solutionSchema';
import { normalizeTags } from '../../common/helper';

export const createSolution = createContract('solution.createSolution')
  .params('userId', 'values')
  .schema({
    userId: S.string(),
    values: S.object().keys({
      challengeId: S.number(),
      ...solutionUserInput,
    }),
  })
  .fn(async (userId, values) => {
    const [user] = await Promise.all([
      getDbUserById(userId),
      await getChallengeById(userId, values.challengeId),
    ]);
    const solvedKey = createKey({
      type: 'CHALLENGE_SOLVED',
      userId: userId,
      challengeId: values.challengeId,
    });
    const dbSolved = await getItem<DbChallengeSolved>(solvedKey);
    if (!dbSolved) {
      throw new AppError(
        'Cannot create a solution if the challenge is not solved'
      );
    }
    const id = uuid();
    values.tags = normalizeTags(values.tags);
    const dbSolution = await _createSolution({
      id,
      userId: userId,
      createdAt: Date.now(),
      likes: 0,
      ...values,
    });
    return mapDbSolution(dbSolution, user);
  });

export const createSolutionRpc = createRpcBinding({
  injectUser: true,
  signature: 'solution.createSolution',
  handler: createSolution,
});
