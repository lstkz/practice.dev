import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
import { _createSolution } from './_createSolution';
import { _getSolutionWithPermissionCheck } from './_getSolutionWithCheck';
import * as db from '../../common/db-next';

export const removeSolution = createContract('solution.removeSolution')
  .params('userId', 'solutionId')
  .schema({
    userId: S.string(),
    solutionId: S.string(),
  })
  .fn(async (userId, solutionId) => {
    const solution = await _getSolutionWithPermissionCheck(userId, solutionId);
    await db.remove(solution.prepareDelete());
  });

export const removeSolutionRpc = createRpcBinding({
  injectUser: true,
  signature: 'solution.removeSolution',
  handler: removeSolution,
});
