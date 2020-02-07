import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
import { getDbSolutionById } from './getDbSolutionById';
import { getDbUserById } from '../user/getDbUserById';
import { mapDbSolution } from '../../common/mapping';

export const getSolutionById = createContract('solution.getSolutionById')
  .params('id')
  .schema({
    id: S.string(),
  })
  .fn(async id => {
    const solution = await getDbSolutionById(id, false);
    const user = await getDbUserById(solution.userId);
    return mapDbSolution(solution, user);
  });

export const getSolutionByIdRpc = createRpcBinding({
  public: true,
  signature: 'solution.getSolutionById',
  handler: getSolutionById,
});
