import { S } from 'schema';
import { createContract, createDynamoStreamBinding } from '../../lib';
import { SolutionVoteEntity, SolutionEntity } from '../../entities';
import * as db from '../../common/db-next';
import { EventEntity } from '../../entities/EventEntity';
import { TABLE_NAME } from '../../config';
import { Converter } from 'aws-sdk/clients/dynamodb';
import { ignoreTransactionCanceled } from '../../common/helper';

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
    await db
      .transactWriteItems([
        {
          Put: EventEntity.getEventConditionPutItem(eventId),
        },
        {
          Update: {
            TableName: TABLE_NAME,
            Key: Converter.marshall(
              SolutionEntity.createKey({ challengeId, solutionId })
            ),
            UpdateExpression: `SET data2_n = data2_n + :inc`,
            ExpressionAttributeValues: Converter.marshall({
              ':inc': add,
            }),
          },
        },
      ])
      .catch(ignoreTransactionCanceled());
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
