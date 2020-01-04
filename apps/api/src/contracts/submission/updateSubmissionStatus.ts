import { createContract } from '../../lib';
import { S } from 'schema';
import { SubmissionStatus } from 'shared';
import { getDbSubmissionById } from './getDbSubmissionById';
import { _putSubmission } from './_putSubmission';
import { markSolved } from '../challenge/markSolved';

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
    const submission = await getDbSubmissionById(submissionId);

    await _putSubmission(
      {
        ...submission,
        status: values.status,
        result: values.result,
      },
      false
    );

    if (values.status === SubmissionStatus.Pass) {
      await markSolved({
        challengeId: submission.challengeId,
        userId: submission.userId,
        solvedAt: Date.now(),
      });
    }
  });
