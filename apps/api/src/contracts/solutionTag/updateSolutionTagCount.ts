import { createContract, createDynamoStreamBinding } from '../../lib';
import { S } from 'schema';
import * as R from 'remeda';
import { Converter } from 'aws-sdk/clients/dynamodb';
import { DbSolution } from '../../types';
import { transactWriteItems, createKey } from '../../common/db';
import { ignoreTransactionCanceled } from '../../common/helper';

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
    await transactWriteItems({
      conditionalPutItems: [
        {
          expression: 'attribute_not_exists(pk)',
          item: createKey({
            type: 'EVENT',
            eventId,
          }),
        },
      ],
      updateItems: tags.map(({ tag, add }) => ({
        Key: Converter.marshall(
          createKey({
            type: 'GLOBAL_SOLUTION_TAG',
            challengeId: challengeId,
            tag: tag,
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
      })),
    }).catch(ignoreTransactionCanceled());
  });

export const handleSolution = createDynamoStreamBinding<DbSolution>({
  type: 'Solution',
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
