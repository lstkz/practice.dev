import { createContract } from '../../lib';
import { S } from 'schema';
import { SubmissionStatus } from 'shared';
import { markSolved } from '../challenge/markSolved';
import * as db from '../../common/db-next';
import { SubmissionEntity } from '../../entities';

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
    const submission = await db.get(SubmissionEntity, {
      submissionId,
    });
    submission.status = values.status;
    submission.result = values.result;
    await db.update(submission.prepareUpdate(['status', 'result']));
    if (values.status === SubmissionStatus.Pass) {
      await markSolved({
        challengeId: submission.challengeId,
        userId: submission.userId,
        solvedAt: Date.now(),
      });
    }
  });
