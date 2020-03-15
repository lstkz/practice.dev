import { createContract, createDynamoStreamBinding } from '../../lib';
import { S } from 'schema';
import * as R from 'remeda';
import { DbSolution } from '../../types';
import {
  transactWriteItems,
  createKey,
  batchDelete,
  getEventConditionItem,
} from '../../common/db';
import { ignoreTransactionCanceled } from '../../common/helper';

function _getKeys(dbSolution: DbSolution) {
  return [
    createKey({
      type: 'SOLUTION_SLUG',
      ...dbSolution,
    }),
    createKey({
      type: 'SOLUTION_USER',
      ...dbSolution,
    }),
    createKey({
      type: 'SOLUTION_CHALLENGE_USER',
      ...dbSolution,
    }),
    ...dbSolution.tags.map(tag => ({
      ...createKey({
        type: 'SOLUTION_TAG',
        challengeId: dbSolution.challengeId,
        solutionId: dbSolution.solutionId,
        tag,
      }),
    })),
  ];
}

export const indexSolutionRemove = createContract(
  'indexSolution.indexSolutionRemove'
)
  .params('eventId', 'dbSolution')
  .schema({
    eventId: S.string(),
    dbSolution: S.object().as<DbSolution>(),
  })
  .fn(async (_, dbSolution) => {
    await batchDelete(_getKeys(dbSolution));
  });

export const indexSolutionInsert = createContract(
  'indexSolution.indexSolutionInsert'
)
  .params('eventId', 'dbSolution')
  .schema({
    eventId: S.string(),
    dbSolution: S.object().as<DbSolution>(),
  })
  .fn(async (eventId, dbSolution) => {
    await transactWriteItems({
      conditionalPutItems: [getEventConditionItem(eventId)],
      putItems: _getKeys(dbSolution).map(key => ({
        ...dbSolution,
        ...key,
      })),
    }).catch(ignoreTransactionCanceled());
  });

export const indexSolutionUpdate = createContract(
  'indexSolution.indexSolutionInsert'
)
  .params('eventId', 'newDbSolution', 'oldDbSolution')
  .schema({
    eventId: S.string(),
    newDbSolution: S.object().as<DbSolution>(),
    oldDbSolution: S.object().as<DbSolution>(),
  })
  .fn(async (eventId, newDbSolution, oldDbSolution) => {
    const removedTags = R.difference(oldDbSolution.tags, newDbSolution.tags);

    await transactWriteItems({
      conditionalPutItems: [getEventConditionItem(eventId)],
      putItems: [
        ..._getKeys(newDbSolution).map(key => ({
          ...newDbSolution,
          ...key,
        })),
      ],
      deleteItems: removedTags.map(tag =>
        createKey({
          type: 'SOLUTION_TAG',
          challengeId: newDbSolution.challengeId,
          solutionId: newDbSolution.solutionId,
          tag,
        })
      ),
    }).catch(ignoreTransactionCanceled());
  });

export const handleSolution = createDynamoStreamBinding<DbSolution>({
  type: 'Solution',
  remove(eventId, item) {
    indexSolutionRemove(eventId, item);
  },
  insert(eventId, item) {
    indexSolutionInsert(eventId, item);
  },
  modify(eventId, item, oldItem) {
    indexSolutionUpdate(eventId, item, oldItem);
  },
});
