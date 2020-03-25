import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
import { AppError } from '../../common/errors';
import * as solutionReader from '../../readers/solutionReader';
import { SolutionVoteEntity } from '../../entities';
import { transactWriteItems } from '../../common/db-next';

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
    const solution = await solutionReader.getByIdOrNull(values.solutionId);
    if (!solution) {
      throw new AppError('Solution not found');
    }

    const vote = new SolutionVoteEntity({
      createdAt: Date.now(),
      solutionId: solution.solutionId,
      challengeId: solution.challengeId,
      userId,
    });
    const changed = await transactWriteItems([
      values.like
        ? {
            Put: {
              ...vote.preparePut(),
              ConditionExpression: 'attribute_not_exists(pk)',
            },
          }
        : {
            Delete: {
              ...vote.prepareDelete(),
              ConditionExpression: 'attribute_exists(pk)',
            },
          },
    ])
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
