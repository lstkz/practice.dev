import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
import { _createSolution } from './_createSolution';
import { getDbUserById } from '../user/getDbUserById';
import { getDbSolutionById } from './getDbSolutionById';
import { assertAuthorOrAdmin } from '../../common/helper';
import { transactWriteItems, createKey } from '../../common/db';

export const removeSolution = createContract('solution.removeSolution')
  .params('userId', 'solutionId')
  .schema({
    userId: S.string(),
    solutionId: S.string(),
  })
  .fn(async (userId, solutionId) => {
    const [user, dbSolution] = await Promise.all([
      getDbUserById(userId),
      getDbSolutionById(solutionId, true),
    ]);
    assertAuthorOrAdmin(dbSolution, user);

    const keys = [
      createKey({
        type: 'SOLUTION',
        ...dbSolution,
      }),
      createKey({
        type: 'SOLUTION_SLUG',
        ...dbSolution,
      }),
      createKey({
        type: 'SOLUTION_USER',
        ...dbSolution,
      }),
      createKey({
        type: 'SOLUTION_CHALLENGE_USER',
        ...dbSolution,
      }),
      ...dbSolution.tags.map(tag => ({
        ...createKey({
          type: 'SOLUTION_TAG',
          challengeId: dbSolution.challengeId,
          solutionId: dbSolution.solutionId,
          tag,
        }),
      })),
    ];

    await transactWriteItems({
      deleteItems: keys,
    });
  });

export const removeSolutionRpc = createRpcBinding({
  injectUser: true,
  signature: 'solution.removeSolution',
  handler: removeSolution,
});
