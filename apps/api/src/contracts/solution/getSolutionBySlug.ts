import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
import { AppError } from '../../common/errors';
import * as solutionReader from '../../readers/solutionReader';
import { _populateSolution } from './_populateSolution';

export const getSolutionBySlug = createContract('solution.getSolutionBySlug')
  .params('userId', 'challengeId', 'slug')
  .schema({
    userId: S.string().optional(),
    challengeId: S.number(),
    slug: S.string(),
  })
  .fn(async (userId, challengeId, slug) => {
    const solution = await solutionReader.getSolutionBySlugOrNull(
      challengeId,
      slug
    );
    if (!solution) {
      throw new AppError('Solution not found');
    }
    return _populateSolution(solution, userId);
  });

export const getSolutionBySlugRpc = createRpcBinding({
  injectUser: true,
  public: true,
  signature: 'solution.getSolutionBySlug',
  handler: getSolutionBySlug,
});
