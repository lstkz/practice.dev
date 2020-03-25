import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
import { getChallengeById } from '../challenge/getChallengeById';
import { AppError } from '../../common/errors';
import uuid from 'uuid';
import { _createSolution } from './_createSolution';
import { solutionUserInput } from './_solutionSchema';
import { normalizeTags } from '../../common/helper';
import * as userReader from '../../readers/userReader';
import * as challengeReader from '../../readers/challengeReader';

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
      userReader.getById(userId),
      getChallengeById(userId, values.challengeId),
    ]);
    const isSolved = await challengeReader.getIsSolved(
      userId,
      values.challengeId
    );
    if (!isSolved) {
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
    return dbSolution.toSolution(user);
  });

export const createSolutionRpc = createRpcBinding({
  injectUser: true,
  signature: 'solution.createSolution',
  handler: createSolution,
});
