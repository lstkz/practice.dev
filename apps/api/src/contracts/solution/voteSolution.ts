import { createContract, createRpcBinding } from '../../lib';
import { Converter } from 'aws-sdk/clients/dynamodb';
import { S } from 'schema';
import { createKey, transactWriteItems } from '../../common/db';
import { DbSolutionVote } from '../../types';
import { AppError } from '../../common/errors';
import { getDbSolutionById } from './getDbSolutionById';

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
    const dbSolution = await getDbSolutionById(values.solutionId, false);

    if (!dbSolution) {
      throw new AppError('Solution not found');
    }

    const solutionKey = createKey({
      type: 'SOLUTION',
      ...dbSolution,
    });

    const solutionVoteKey = createKey({
      type: 'SOLUTION_VOTE',
      solutionId: dbSolution.solutionId,
      userId,
    });

    const getNewDbSolutionVote = (): DbSolutionVote => {
      return {
        ...solutionVoteKey,
        data_n: Date.now(),
        solutionId: dbSolution.solutionId,
        userId,
      };
    };

    const getVoteLikeItem = () => {
      if (values.like) {
        return {
          conditionalPutItems: [
            {
              expression: 'attribute_not_exists(pk)',
              item: getNewDbSolutionVote(),
            },
          ],
        };
      } else {
        return {
          conditionalDeleteItems: [
            {
              expression: 'attribute_exists(pk)',
              key: solutionVoteKey,
            },
          ],
        };
      }
    };

    await transactWriteItems({
      ...getVoteLikeItem(),
      updateItems: [
        {
          Key: Converter.marshall(solutionKey),
          UpdateExpression: 'SET data2_n = data2_n + :add, v = v + :inc',
          ExpressionAttributeValues: Converter.marshall({
            ':add': values.like ? 1 : -1,
            ':inc': 1,
          }),
        },
      ],
    }).catch((e: any) => {
      // ignore duplicate votes
      if (e.code === 'TransactionCanceledException') {
        return;
      }
      throw e;
    });
    const latest = await getDbSolutionById(values.solutionId, false);
    return latest!.data2_n;
  });

export const voteSolutionRpc = createRpcBinding({
  verified: true,
  injectUser: true,
  signature: 'solution.voteSolution',
  handler: voteSolution,
});
