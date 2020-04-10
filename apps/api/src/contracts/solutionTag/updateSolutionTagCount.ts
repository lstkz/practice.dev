import {
  createContract,
  createDynamoStreamBinding,
  createTransaction,
} from '../../lib';
import { S } from 'schema';
import * as R from 'remeda';
import {
  SolutionTagStatsEntity,
  SolutionEntity,
  EventEntity,
} from '../../entities';
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
    const t = createTransaction();
    EventEntity.addToTransaction(t, eventId);
    tags.forEach(({ tag, add }) => {
      t.updateRaw({
        tableName: TABLE_NAME,
        key: SolutionTagStatsEntity.createKey({
          challengeId,
          tag,
        }),
        updateExpression: [
          'SET #count = if_not_exists(#count, :zero) + :incr',
          'challengeId = :challengeId',
          '#data = :tag',
        ].join(', '),
        expressionNames: {
          '#count': 'count',
          '#data': 'data',
        },
        expressionValues: {
          ':incr': add,
          ':zero': 0,
          ':challengeId': challengeId,
          ':tag': tag,
        },
      });
    });
    await t.commit({ ignoreTransactionCanceled: true });
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
