import { createContract, createDynamoStreamBinding } from '../../lib';
import { S } from 'schema';
import { ignoreTransactionCanceled } from '../../common/helper';
import { SubmissionEntity } from '../../entities';
import * as db from '../../common/db-next';
import { EventEntity } from '../../entities/EventEntity';

export const indexSubmissionRemove = createContract(
  'indexSubmission.indexSubmissionRemove'
)
  .params('eventId', 'submission')
  .schema({
    eventId: S.string(),
    submission: S.object().as<SubmissionEntity>(),
  })
  .fn(async (_, submission) => {
    await db.remove(submission.getAllIndexes().map(x => x.prepareDelete()));
  });

export const indexSubmission = createContract('indexSubmission.indexSubmission')
  .params('eventId', 'submission')
  .schema({
    eventId: S.string(),
    submission: S.object().as<SubmissionEntity>(),
  })
  .fn(async (eventId, submission) => {
    await db
      .transactWriteItems([
        {
          Put: EventEntity.getEventConditionPutItem(eventId),
        },
        ...submission.getAllIndexes().map(item => ({
          Put: item.preparePut(),
        })),
      ])
      .catch(ignoreTransactionCanceled());
  });

export const handleSubmission = createDynamoStreamBinding<SubmissionEntity>({
  type: 'SubmissionEntity',
  remove(eventId, item) {
    indexSubmissionRemove(eventId, item);
  },
  insert(eventId, item) {
    indexSubmission(eventId, item);
  },
  modify(eventId, item) {
    indexSubmission(eventId, item);
  },
});
