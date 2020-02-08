import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
import { createKey, getItem } from '../../common/db';
import { DbSolution } from '../../types';
import { AppError } from '../../common/errors';
import { _populateSolution } from './_populateSolution';

export const getSolutionBySlug = createContract('solution.getSolutionBySlug')
  .params('userId', 'challengeId', 'slug')
  .schema({
    userId: S.string().optional(),
    challengeId: S.number(),
    slug: S.string(),
  })
  .fn(async (userId, challengeId, slug) => {
    const slugKey = createKey({
      type: 'SOLUTION_SLUG',
      challengeId,
      slug,
    });

    const dbSolution = await getItem<DbSolution>(slugKey);
    if (!dbSolution) {
      throw new AppError('Solution not found');
    }
    return _populateSolution(dbSolution, userId);
  });

export const getSolutionBySlugRpc = createRpcBinding({
  injectUser: true,
  public: true,
  signature: 'solution.getSolutionBySlug',
  handler: getSolutionBySlug,
});
