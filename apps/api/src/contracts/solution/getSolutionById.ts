import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
import { getDbSolutionById } from './getDbSolutionById';
import { _populateSolution } from './_populateSolution';

export const getSolutionById = createContract('solution.getSolutionById')
  .params('userId', 'id')
  .schema({
    userId: S.string().optional(),
    id: S.string(),
  })
  .fn(async (userId, id) => {
    const dbSolution = await getDbSolutionById(id, false);
    return _populateSolution(dbSolution, userId);
  });

export const getSolutionByIdRpc = createRpcBinding({
  injectUser: true,
  public: true,
  signature: 'solution.getSolutionById',
  handler: getSolutionById,
});
