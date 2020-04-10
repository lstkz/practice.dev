import { createContract, createRpcBinding, createTransaction } from '../../lib';
import { S } from 'schema';
import { AppError } from '../../common/errors';
import { SolutionVoteEntity, SolutionEntity } from '../../entities';

export const voteSolution = createContract('solution.voteSolution')
  .params('userId', 'values')
  .schema({
    userId: S.string(),
    values: S.object().keys({
      like: S.boolean(),
      solutionId: S.string(),
    }),
  })
  .fn(async (userId, values) => {
    const solution = await SolutionEntity.getByIdOrNull(values.solutionId);
    if (!solution) {
      throw new AppError('Solution not found');
    }

    const vote = new SolutionVoteEntity({
      createdAt: Date.now(),
      solutionId: solution.solutionId,
      challengeId: solution.challengeId,
      userId,
    });
    const t = createTransaction();
    if (values.like) {
      await t.insert(vote, {
        conditionExpression: 'attribute_not_exists(pk)',
      });
    } else {
      await t.delete(vote, {
        conditionExpression: 'attribute_exists(pk)',
      });
    }
    const changed = await t
      .commit()
      .then(() => true)
      .catch((e: any) => {
        // ignore duplicate votes
        if (e.code === 'TransactionCanceledException') {
          return false;
        }
        throw e;
      });
    if (!changed) {
      return solution.likes;
    }
    return solution.likes + (values.like ? 1 : -1);
  });

export const voteSolutionRpc = createRpcBinding({
  verified: true,
  injectUser: true,
  signature: 'solution.voteSolution',
  handler: voteSolution,
});
