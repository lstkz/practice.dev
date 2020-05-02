import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
import { solutionUserInput } from './_solutionSchema';
import { normalizeTags } from '../../common/helper';
import { _getSolutionWithPermissionCheck } from './_getSolutionWithCheck';
import { UserEntity } from '../../entities';
import { updateSolutionCUD } from '../../cud/solution';

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
    const [solutionAuthor, solution] = await Promise.all([
      UserEntity.getById(userId),
      updateSolutionCUD(oldSolution, {
        ...oldSolution.getProps(),
        ...values,
      }),
    ]);
    return solution.toSolution(solutionAuthor);
  });

export const updateSolutionRpc = createRpcBinding({
  injectUser: true,
  signature: 'solution.updateSolution',
  handler: updateSolution,
});
