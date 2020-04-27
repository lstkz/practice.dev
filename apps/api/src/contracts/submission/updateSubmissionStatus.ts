import { createContract } from '../../lib';
import { S } from 'schema';
import { SubmissionStatus } from 'shared';
import { markSolved } from '../challenge/markSolved';
import { AppError } from '../../common/errors';
import { SubmissionCollection } from '../../collections/Submission';

export const updateSubmissionStatus = createContract(
  'submission.updateSubmissionStatus'
)
  .params('submissionId', 'values')
  .schema({
    submissionId: S.number(),
    values: S.object().keys({
      status: S.enum().values<SubmissionStatus>(
        Object.values(SubmissionStatus)
      ),
      result: S.string().optional(),
    }),
  })
  .fn(async (submissionId, values) => {
    const submission = await SubmissionCollection.findOne({
      _id: submissionId,
    });
    if (!submission) {
      throw new AppError('Submission not found');
    }
    submission.status = values.status;
    submission.result = values.result;
    await SubmissionCollection.update(submission, ['status', 'result']);
    if (values.status === SubmissionStatus.Pass) {
      await markSolved({
        challengeId: submission.challengeId,
        userId: submission.userId,
        solvedAt: new Date(),
      });
    }
  });
