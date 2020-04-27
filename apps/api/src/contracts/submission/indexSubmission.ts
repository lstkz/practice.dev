// import {
//   createContract,
//   createDynamoStreamBinding,
//   createTransaction,
// } from '../../lib';
// import { S } from 'schema';
// import { SubmissionEntity, EventEntity } from '../../entities';

// export const indexSubmissionRemove = createContract(
//   'indexSubmission.indexSubmissionRemove'
// )
//   .params('eventId', 'submission')
//   .schema({
//     eventId: S.string(),
//     submission: S.object().as<SubmissionEntity>(),
//   })
//   .fn(async (_, submission) => {
//     const t = createTransaction();
//     submission.getAllIndexes().forEach(item => {
//       t.delete(item);
//     });
//     await t.commit();
//   });

// export const indexSubmission = createContract('indexSubmission.indexSubmission')
//   .params('eventId', 'submission')
//   .schema({
//     eventId: S.string(),
//     submission: S.object().as<SubmissionEntity>(),
//   })
//   .fn(async (eventId, submission) => {
//     const t = createTransaction();
//     EventEntity.addToTransaction(t, eventId);
//     submission.getAllIndexes().forEach(item => {
//       t.insert(item);
//     });
//     await t.commit({ ignoreTransactionCanceled: true });
//   });

// export const handleSubmission = createDynamoStreamBinding<SubmissionEntity>({
//   type: 'SubmissionEntity',
//   remove(eventId, item) {
//     indexSubmissionRemove(eventId, item);
//   },
//   insert(eventId, item) {
//     indexSubmission(eventId, item);
//   },
//   modify(eventId, item) {
//     indexSubmission(eventId, item);
//   },
// });
