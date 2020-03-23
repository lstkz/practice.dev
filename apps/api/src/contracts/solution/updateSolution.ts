import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
import { _createSolution } from './_createSolution';
import { solutionUserInput } from './_solutionSchema';
import * as userReader from '../../readers/userReader';
import {
  normalizeTags,
  rethrowTransactionCanceled,
  safeKeys,
  safeAssign,
} from '../../common/helper';
import { Converter } from 'aws-sdk/clients/dynamodb';
import { transactWriteItems } from '../../common/db-next';
import { _getSolutionWithPermissionCheck } from './_getSolutionWithCheck';
import { SolutionEntity } from '../../entities';

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

    const slug = new SolutionEntity(solution);

    const [solutionAuthor] = await Promise.all([
      userReader.getById(userId),
      transactWriteItems([
        {
          Update: solution.prepareUpdate(safeKeys(solutionUserInput)),
        },
        {
          Put: {
            ...slug.preparePut(),
            ConditionExpression:
              'attribute_not_exists(pk) OR (attribute_exists(pk) AND solutionId = :solutionId)',
            ExpressionAttributeValues: Converter.marshall({
              ':solutionId': solutionId,
            }),
          },
        },
      ]).catch(
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
