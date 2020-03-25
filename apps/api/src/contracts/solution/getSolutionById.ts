import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
import * as solutionReader from '../../readers/solutionReader';
import { _populateSolution } from './_populateSolution';
import { AppError } from '../../common/errors';

export const getSolutionById = createContract('solution.getSolutionById')
  .params('userId', 'id')
  .schema({
    userId: S.string().optional(),
    id: S.string(),
  })
  .fn(async (userId, id) => {
    const solution = await solutionReader.getByIdOrNull(id);
    if (!solution) {
      throw new AppError('Solution not found');
    }
    return _populateSolution(solution, userId);
  });

export const getSolutionByIdRpc = createRpcBinding({
  injectUser: true,
  public: true,
  signature: 'solution.getSolutionById',
  handler: getSolutionById,
});
