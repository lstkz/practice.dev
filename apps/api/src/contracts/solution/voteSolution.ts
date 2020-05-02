import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
import { AppError } from '../../common/errors';
import { SolutionEntity, SolutionVoteProps } from '../../entities';
import {
  createSolutionVoteCUD,
  removeSolutionVoteCUD,
} from '../../cud/solutionVote';
import { doFn } from '../../common/helper';

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
    const solution = await SolutionEntity.getByKeyOrNull({
      solutionId: values.solutionId,
    });
    if (!solution) {
      throw new AppError('Solution not found');
    }
    const voteProps: SolutionVoteProps = {
      createdAt: Date.now(),
      solutionId: solution.solutionId,
      challengeId: solution.challengeId,
      userId,
    };

    const changed = await doFn(async () => {
      if (values.like) {
        await createSolutionVoteCUD(voteProps);
      } else {
        await removeSolutionVoteCUD(voteProps);
      }
    })
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
