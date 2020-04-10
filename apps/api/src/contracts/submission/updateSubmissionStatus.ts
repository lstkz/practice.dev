import { createContract } from '../../lib';
import { S } from 'schema';
import { SubmissionStatus } from 'shared';
import { markSolved } from '../challenge/markSolved';
import { SubmissionEntity } from '../../entities';
import { AppError } from '../../common/errors';

export const updateSubmissionStatus = createContract(
  'submission.updateSubmissionStatus'
)
  .params('submissionId', 'values')
  .schema({
    submissionId: S.string(),
    values: S.object().keys({
      status: S.enum().values<SubmissionStatus>(
        Object.values(SubmissionStatus)
      ),
      result: S.string().optional(),
    }),
  })
  .fn(async (submissionId, values) => {
    const submission = await SubmissionEntity.getByKeyOrNull({ submissionId });
    if (!submission) {
      throw new AppError('Submission not found');
    }
    submission.status = values.status;
    submission.result = values.result;
    await submission.update(['status', 'result']);
    if (values.status === SubmissionStatus.Pass) {
      await markSolved({
        challengeId: submission.challengeId,
        userId: submission.userId,
        solvedAt: Date.now(),
      });
    }
  });
