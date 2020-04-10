import { createContract, createRpcBinding, createTransaction } from '../../lib';
import { S } from 'schema';
import { _createSolution } from './_createSolution';
import { solutionUserInput } from './_solutionSchema';
import {
  normalizeTags,
  rethrowTransactionCanceled,
  safeKeys,
  safeAssign,
} from '../../common/helper';
import { _getSolutionWithPermissionCheck } from './_getSolutionWithCheck';
import { SolutionEntity, UserEntity } from '../../entities2';

export const updateSolution = createContract('solution.updateSolution')
  .params('userId', 'solutionId', 'values')
  .schema({
    userId: S.string(),
    solutionId: S.string(),
    values: S.object().keys(solutionUserInput),
  })
  .fn(async (userId, solutionId, values) => {
    const solution = await _getSolutionWithPermissionCheck(userId, solutionId);
    safeAssign(solution, values);
    values.tags = normalizeTags(values.tags);

    const slug = new SolutionEntity(solution, { type: 'slug' });
    const t = createTransaction();
    t.update(solution, safeKeys(solutionUserInput));
    t.insert(slug, {
      conditionExpression:
        'attribute_not_exists(pk) OR (attribute_exists(pk) AND solutionId = :solutionId)',
      expressionValues: {
        ':solutionId': solutionId,
      },
    });

    const [solutionAuthor] = await Promise.all([
      UserEntity.getById(userId),
      t
        .commit()
        .catch(
          rethrowTransactionCanceled('Duplicated slug for this challenge')
        ),
    ]);
    return solution.toSolution(solutionAuthor);
  });

export const updateSolutionRpc = createRpcBinding({
  injectUser: true,
  signature: 'solution.updateSolution',
  handler: updateSolution,
});
