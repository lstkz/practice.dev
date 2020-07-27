import { createTransaction } from '../lib';
import { SubmissionProps, SubmissionEntity } from '../entities';
import { updateUserStats } from './user';
import { updateChallengeStats } from './challenge';
import { UnreachableCaseError } from '../common/errors';
import { updateProjectStats } from './project';
import { Transaction } from '../orm/Transaction';

function _updateStats(
  t: Transaction,
  submission: SubmissionEntity,
  diff: number
) {
  updateUserStats(t, submission.userId, 'submissions', diff);
  switch (submission.type) {
    case 'challenge':
      updateChallengeStats(t, submission.challengeId, 'submissions', diff);
      break;
    case 'project':
      updateProjectStats(
        t,
        submission.projectId!,
        submission.challengeId,
        'submissions',
        diff
      );
      break;
    default:
      throw new UnreachableCaseError(submission.type);
  }
}

export async function createSubmissionCUD(props: SubmissionProps) {
  const t = createTransaction();
  const submission = new SubmissionEntity(props);
  t.insert(submission);
  _updateStats(t, submission, 1);
  await t.commit();
  return submission;
}

export async function removeSubmissionCUD(submission: SubmissionEntity) {
  const t = createTransaction();
  t.delete(submission);
  _updateStats(t, submission, -1);
  await t.commit();
}
