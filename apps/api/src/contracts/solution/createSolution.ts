import { createContract, createRpcBinding, getLoggedInUser } from '../../lib';
import { S } from 'schema';
import { getChallengeById } from '../challenge/getChallengeById';
import { createKey, getItem } from '../../common/db';
import { DbChallengeSolved } from '../../types';
import { AppError } from '../../common/errors';
import uuid = require('uuid');
import { _createSolution } from './_createSolution';
import { mapDbSolution } from '../../common/mapping';

const urlReg = /^https\:\/\/((codesandbox\.io)|(github\.com))/;

export const createSolution = createContract('solution.createSolution')
  .params('values')
  .schema({
    values: S.object().keys({
      challengeId: S.number(),
      url: S.string()
        .max(300)
        .regex(urlReg),
      title: S.string().max(50),
      slug: S.string()
        .max(30)
        .regex(/^[a-z0-9\-]+$/),
      description: S.string()
        .max(500)
        .optional(),
      tags: S.array()
        .items(S.string().max(20))
        .min(1)
        .max(5),
    }),
  })
  .fn(async values => {
    const user = getLoggedInUser();
    await getChallengeById(values.challengeId);
    const solvedKey = createKey({
      type: 'CHALLENGE_SOLVED',
      userId: user.userId,
      challengeId: values.challengeId,
    });
    const dbSolved = await getItem<DbChallengeSolved>(solvedKey);
    if (!dbSolved) {
      throw new AppError(
        'Cannot create a solution if the challenge is not solved'
      );
    }
    const id = uuid();
    const dbSolution = await _createSolution({
      id,
      userId: user.userId,
      createdAt: Date.now(),
      likes: 0,
      ...values,
    });
    return mapDbSolution(dbSolution, user);
  });

export const createSolutionRpc = createRpcBinding({
  signature: 'solution.createSolution',
  handler: createSolution,
});
