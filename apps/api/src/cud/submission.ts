import { createTransaction } from '../lib';
import { SubmissionProps, SubmissionEntity } from '../entities';
import { updateUserStats } from './user';
import { updateChallengeStats } from './challenge';

export async function createSubmissionCUD(props: SubmissionProps) {
  const t = createTransaction();
  const submission = new SubmissionEntity(props);
  t.insert(submission);
  updateUserStats(t, submission.userId, 'submissions', 1);
  updateChallengeStats(t, submission.challengeId, 'submissions', 1);
  await t.commit();
  return submission;
}
