import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
import { solutionUserInput } from './_solutionSchema';
import { normalizeTags } from '../../common/helper';
import { _getSolutionWithPermissionCheck } from './_getSolutionWithCheck';
import { updateSolutionCUD } from '../../cud/solution';
import { _populateSolution } from './_populateSolution';

export const updateSolution = createContract('solution.updateSolution')
  .params('userId', 'solutionId', 'values')
  .schema({
    userId: S.string(),
    solutionId: S.string(),
    values: S.object().keys(solutionUserInput),
  })
  .fn(async (userId, solutionId, values) => {
    const oldSolution = await _getSolutionWithPermissionCheck(
      userId,
      solutionId
    );
    values.tags = normalizeTags(values.tags);
    const solution = await updateSolutionCUD(oldSolution, {
      ...oldSolution.getProps(),
      ...values,
    });
    return _populateSolution(solution, userId);
  });

export const updateSolutionRpc = createRpcBinding({
  injectUser: true,
  signature: 'solution.updateSolution',
  handler: updateSolution,
});
