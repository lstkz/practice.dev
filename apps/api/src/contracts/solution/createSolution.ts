import { createContract, createRpcBinding } from '../../lib';
import * as R from 'remeda';
import { S } from 'schema';
import { getChallengeById } from '../challenge/getChallengeById';
import { createKey, getItem } from '../../common/db';
import { DbChallengeSolved } from '../../types';
import { AppError } from '../../common/errors';
import uuid from 'uuid';
import { _createSolution } from './_createSolution';
import { mapDbSolution } from '../../common/mapping';
import { getDbUserById } from '../user/getDbUserById';

const urlReg = /^https\:\/\/((codesandbox\.io)|(github\.com))/;

export const createSolution = createContract('solution.createSolution')
  .params('userId', 'values')
  .schema({
    userId: S.string(),
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
        .items(
          S.string()
            .trim()
            .min(1)
            .max(20)
        )
        .min(1)
        .max(5),
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
    values.tags = R.uniq(values.tags.map(x => x.toLowerCase()));
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
