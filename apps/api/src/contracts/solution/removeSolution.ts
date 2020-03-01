import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
import { _createSolution } from './_createSolution';
import { getDbUserById } from '../user/getDbUserById';
import { getDbSolutionById } from './getDbSolutionById';
import { assertAuthorOrAdmin } from '../../common/helper';
import { deleteItem } from '../../common/db';

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

    await deleteItem(dbSolution);
  });

export const removeSolutionRpc = createRpcBinding({
  injectUser: true,
  signature: 'solution.removeSolution',
  handler: removeSolution,
});
