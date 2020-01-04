import { DbSubmission } from '../../types';
import { createKey, transactWriteItems } from '../../common/db';
import { createStatsUpdate } from '../challenge/createStatsUpdate';

export async function _putSubmission(submission: DbSubmission, isNew: boolean) {
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
  ];

  await transactWriteItems({
    putItems: items,
    updateItems: isNew
      ? [createStatsUpdate(submission.challengeId, 'submissions', 1)]
      : [],
  });
}
