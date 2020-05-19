import { createTransaction } from '../lib';
import { SubmissionProps, SubmissionEntity } from '../entities';
import { updateUserStats } from './user';
import { updateChallengeStats } from './challenge';
import { UnreachableCaseError } from '../common/errors';
import { updateProjectStats } from './project';

export async function createSubmissionCUD(props: SubmissionProps) {
  const t = createTransaction();
  const submission = new SubmissionEntity(props);
  t.insert(submission);
  updateUserStats(t, submission.userId, 'submissions', 1);
  switch (props.type) {
    case 'challenge':
      updateChallengeStats(t, submission.challengeId, 'submissions', 1);
      break;
    case 'project':
      updateProjectStats(
        t,
        submission.projectId!,
        submission.challengeId,
        'submissions',
        1
      );
      break;
    default:
      throw new UnreachableCaseError(props.type);
  }
  await t.commit();
  return submission;
}
