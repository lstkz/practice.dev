import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
import { AppError } from '../../common/errors';
import { _populateSolution } from './_populateSolution';
import { SolutionEntity } from '../../entities2';

export const getSolutionBySlug = createContract('solution.getSolutionBySlug')
  .params('userId', 'challengeId', 'slug')
  .schema({
    userId: S.string().optional(),
    challengeId: S.number(),
    slug: S.string(),
  })
  .fn(async (userId, challengeId, slug) => {
    const solution = await SolutionEntity.getByKeyOrNull({
      __indexType: 'slug',
      slug: slug,
      challengeId,
    });
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
