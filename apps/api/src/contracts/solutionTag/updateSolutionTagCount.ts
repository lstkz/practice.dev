import { createContract, createDynamoStreamBinding } from '../../lib';
import { S } from 'schema';
import * as R from 'remeda';
import { Converter } from 'aws-sdk/clients/dynamodb';
import { ignoreTransactionCanceled } from '../../common/helper';
import * as db from '../../common/db-next';
import { EventEntity } from '../../entities/EventEntity';
import { SolutionTagStatsEntity, SolutionEntity } from '../../entities';
import { TABLE_NAME } from '../../config';

export const updateSolutionTagCount = createContract(
  'solutionTag.updateSolutionTagCount'
)
  .params('eventId', 'challengeId', 'addTags', 'removeTags')
  .schema({
    eventId: S.string(),
    challengeId: S.number(),
    addTags: S.array().items(
      S.string()
        .trim()
        .lowercase()
    ),
    removeTags: S.array().items(
      S.string()
        .trim()
        .lowercase()
    ),
  })
  .fn(async (eventId, challengeId, addTags, removeTags) => {
    const tags = [
      ...addTags.map(tag => ({ tag, add: 1 })),
      ...removeTags.map(tag => ({ tag, add: -1 })),
    ];

    await db
      .transactWriteItems([
        {
          Put: EventEntity.getEventConditionPutItem(eventId),
        },
        ...tags.map(({ tag, add }) => ({
          Update: {
            TableName: TABLE_NAME,
            Key: Converter.marshall(
              SolutionTagStatsEntity.createKey({
                challengeId,
                tag,
              })
            ),
            UpdateExpression: [
              'SET #count = if_not_exists(#count, :zero) + :incr',
              'challengeId = :challengeId',
              '#data = :tag',
            ].join(', '),
            ExpressionAttributeNames: {
              '#count': 'count',
              '#data': 'data',
            },
            ExpressionAttributeValues: Converter.marshall({
              ':incr': add,
              ':zero': 0,
              ':challengeId': challengeId,
              ':tag': tag,
            }),
          },
        })),
      ])
      .catch(ignoreTransactionCanceled());
  });

export const handleSolution = createDynamoStreamBinding<SolutionEntity>({
  type: 'SolutionEntity',
  insert(eventId, item) {
    return updateSolutionTagCount(eventId, item.challengeId, item.tags, []);
  },
  remove(eventId, item) {
    return updateSolutionTagCount(eventId, item.challengeId, [], item.tags);
  },
  modify(eventId, newItem, oldItem) {
    const newTags = R.difference(newItem.tags, oldItem.tags);
    const removedTags = R.difference(oldItem.tags, newItem.tags);
    return updateSolutionTagCount(
      eventId,
      newItem.challengeId,
      newTags,
      removedTags
    );
  },
});
