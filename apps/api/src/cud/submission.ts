import { createTransaction } from '../lib';
import { SubmissionProps, SubmissionEntity } from '../entities';
import { updateUserStats } from './user';

export async function createSubmissionCUD(props: SubmissionProps) {
  const t = createTransaction();
  const submission = new SubmissionEntity(props);
  t.insert(submission);
  updateUserStats(t, submission.userId, 'submissions', 1);
  await t.commit();
  return submission;
}
