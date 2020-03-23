import { createContract, createDynamoStreamBinding } from '../../lib';
import { S } from 'schema';
import * as R from 'remeda';
import { ignoreTransactionCanceled } from '../../common/helper';
import { SolutionEntity } from '../../entities';
import * as db from '../../common/db-next';
import { EventEntity } from '../../entities/EventEntity';

export const indexSolutionRemove = createContract(
  'indexSolution.indexSolutionRemove'
)
  .params('eventId', 'solution')
  .schema({
    eventId: S.string(),
    solution: S.object().as<SolutionEntity>(),
  })
  .fn(async (_, solution) => {
    await db.remove(solution.getAllIndexes().map(x => x.prepareDelete()));
  });

export const indexSolutionInsert = createContract(
  'indexSolution.indexSolutionInsert'
)
  .params('eventId', 'solution')
  .schema({
    eventId: S.string(),
    solution: S.object().as<SolutionEntity>(),
  })
  .fn(async (eventId, solution) => {
    await db
      .transactWriteItems([
        {
          Put: EventEntity.getEventConditionPutItem(eventId),
        },
        ...solution.getAllIndexes().map(item => ({
          Put: item.preparePut(),
        })),
      ])
      .catch(ignoreTransactionCanceled());
  });

export const indexSolutionUpdate = createContract(
  'indexSolution.indexSolutionInsert'
)
  .params('eventId', 'newSolution', 'oldSolution')
  .schema({
    eventId: S.string(),
    newSolution: S.object().as<SolutionEntity>(),
    oldSolution: S.object().as<SolutionEntity>(),
  })
  .fn(async (eventId, newSolution, oldSolution) => {
    const removedTags = R.difference(newSolution.tags, oldSolution.tags);
    await db
      .transactWriteItems([
        {
          Put: EventEntity.getEventConditionPutItem(eventId),
        },
        ...newSolution.getAllIndexes().map(item => ({
          Put: item.preparePut(),
        })),
        ...removedTags.map(tag => ({
          Delete: oldSolution.asTagEntity(tag).prepareDelete(),
        })),
      ])
      .catch(ignoreTransactionCanceled());
  });

export const handleSolution = createDynamoStreamBinding<SolutionEntity>({
  type: 'SolutionEntity',
  async remove(eventId, item) {
    await indexSolutionRemove(eventId, item);
  },
  async insert(eventId, item) {
    await indexSolutionInsert(eventId, item);
  },
  async modify(eventId, item, oldItem) {
    await indexSolutionUpdate(eventId, item, oldItem);
  },
});
