import { S } from 'schema';
import {
  createContract,
  createDynamoStreamBinding,
  createTransaction,
} from '../../lib';
import {
  SolutionVoteEntity,
  SolutionEntity,
  EventEntity,
} from '../../entities';
import { TABLE_NAME } from '../../config';

export const updateSolutionLikes = createContract(
  'solution.updateSolutionLikes'
)
  .params('eventId', 'challengeId', 'solutionId', 'add')
  .schema({
    eventId: S.string(),
    challengeId: S.number(),
    solutionId: S.string(),
    add: S.number(),
  })
  .fn(async (eventId, challengeId, solutionId, add) => {
    const t = createTransaction();
    EventEntity.addToTransaction(t, eventId);
    t.updateRaw({
      tableName: TABLE_NAME,
      key: SolutionEntity.createKey({ challengeId, solutionId }),
      updateExpression: `SET data2_n = data2_n + :inc`,
      expressionValues: {
        ':inc': add,
      },
    });
    await t.commit({
      ignoreTransactionCanceled: true,
    });
  });

export const handleSolutionVote = createDynamoStreamBinding<SolutionVoteEntity>(
  {
    type: 'SolutionVoteEntity',
    async remove(eventId, item) {
      await updateSolutionLikes(eventId, item.challengeId, item.solutionId, -1);
    },
    async insert(eventId, item) {
      await updateSolutionLikes(eventId, item.challengeId, item.solutionId, 1);
    },
  }
);
