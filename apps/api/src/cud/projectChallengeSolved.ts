import {
  ProjectChallengeSolvedProps,
  ProjectChallengeSolvedEntity,
} from '../entities';
import { createTransaction } from '../lib';
import { CommitOptions } from '../orm/Transaction';
import { updateUserStats } from './user';
import { updateProjectStats } from './project';

export async function createProjectChallengeSolvedCUD(
  props: ProjectChallengeSolvedProps,
  options?: CommitOptions
) {
  const solved = new ProjectChallengeSolvedEntity(props);
  const t = createTransaction();
  t.insert(solved, {
    conditionExpression: 'attribute_not_exists(pk)',
  });
  updateUserStats(t, solved.userId, 'solved', 1);
  updateProjectStats(t, props.projectId, props.challengeId, 'solved', 1);
  await t.commit(options);
}
