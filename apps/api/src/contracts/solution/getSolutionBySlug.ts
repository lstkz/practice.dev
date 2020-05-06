import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
import { AppError } from '../../common/errors';
import { _populateSolution } from './_populateSolution';
import { SolutionEntity, SolutionSlugEntity } from '../../entities';

export const getSolutionBySlug = createContract('solution.getSolutionBySlug')
  .params('userId', 'challengeId', 'slug')
  .schema({
    userId: S.string().optional(),
    challengeId: S.number(),
    slug: S.string(),
  })
  .fn(async (userId, challengeId, slug) => {
    const solutionSlug = await SolutionSlugEntity.getByKeyOrNull({
      slug: slug,
      challengeId,
    });
    if (!solutionSlug) {
      throw new AppError('Solution not found');
    }
    const solution = await SolutionEntity.getByKey({
      solutionId: solutionSlug.solutionId,
    });
    return _populateSolution(solution, userId);
  });

export const getSolutionBySlugRpc = createRpcBinding({
  injectUser: true,
  public: true,
  signature: 'solution.getSolutionBySlug',
  handler: getSolutionBySlug,
});
