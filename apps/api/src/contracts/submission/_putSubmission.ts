import { DbSubmission } from '../../types';
import { createKey, transactWriteItems } from '../../common/db';

export async function _putSubmission(submission: DbSubmission) {
  const items: DbSubmission[] = [
    submission,
    {
      ...submission,
      ...createKey({
        type: 'SUBMISSION_USER',
        userId: submission.userId,
        submissionId: submission.submissionId,
      }),
    },
    {
      ...submission,
      ...createKey({
        type: 'SUBMISSION_CHALLENGE',
        challengeId: submission.challengeId,
        submissionId: submission.submissionId,
      }),
    },
    {
      ...submission,
      ...createKey({
        type: 'SUBMISSION_USER_CHALLENGE',
        userId: submission.userId,
        challengeId: submission.challengeId,
        submissionId: submission.submissionId,
      }),
    },
  ];

  await transactWriteItems({
    putItems: items,
  });
}
