import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
import { _getSolutionWithPermissionCheck } from './_getSolutionWithCheck';
import { removeSolutionCUD } from '../../cud/solution';

export const removeSolution = createContract('solution.removeSolution')
  .params('userId', 'solutionId')
  .schema({
    userId: S.string(),
    solutionId: S.string(),
  })
  .fn(async (userId, solutionId) => {
    const solution = await _getSolutionWithPermissionCheck(userId, solutionId);
    await removeSolutionCUD(solution);
  });

export const removeSolutionRpc = createRpcBinding({
  injectUser: true,
  signature: 'solution.removeSolution',
  handler: removeSolution,
});
