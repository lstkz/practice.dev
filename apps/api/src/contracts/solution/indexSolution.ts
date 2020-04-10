import {
  createContract,
  createDynamoStreamBinding,
  createTransaction,
} from '../../lib';
import { S } from 'schema';
import * as R from 'remeda';
import { SolutionEntity, EventEntity } from '../../entities2';

export const indexSolutionRemove = createContract(
  'indexSolution.indexSolutionRemove'
)
  .params('eventId', 'solution')
  .schema({
    eventId: S.string(),
    solution: S.object().as<SolutionEntity>(),
  })
  .fn(async (_, solution) => {
    const t = createTransaction();
    solution.getAllIndexes().forEach(item => {
      t.delete(item);
    });
    await t.commit();
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
    const t = createTransaction();
    EventEntity.addToTransaction(t, eventId);
    solution.getAllIndexes().forEach(item => {
      t.insert(item);
    });
    await t.commit({
      ignoreTransactionCanceled: true,
    });
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
    const removedTags = R.difference(oldSolution.tags, newSolution.tags);
    const t = createTransaction();
    EventEntity.addToTransaction(t, eventId);
    newSolution.getAllIndexes().forEach(item => {
      t.insert(item);
    });
    removedTags.forEach(tag => {
      t.delete(oldSolution.asTagEntity(tag));
    });
    await t.commit({
      ignoreTransactionCanceled: true,
    });
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
