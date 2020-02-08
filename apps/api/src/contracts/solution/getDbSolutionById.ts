import { createContract } from '../../lib';
import { S } from 'schema';
import { AppError } from '../../common/errors';
import { createKey, queryMainIndexAll } from '../../common/db';
import { DbSolution } from '../../types';

export const getDbSolutionById = createContract('solution.getDbSolutionById')
  .params('id', 'consistentRead')
  .schema({
    id: S.string(),
    consistentRead: S.boolean().optional(),
  })
  .fn(async (id, consistentRead) => {
    const solutionKey = createKey({
      type: 'SOLUTION',
      solutionId: id,
      challengeId: -1,
    });
    const [dbSolution] = await queryMainIndexAll<DbSolution>({
      pk: solutionKey.pk,
      consistentRead,
    });
    if (!dbSolution) {
      throw new AppError('Solution not found');
    }
    return dbSolution;
  });
