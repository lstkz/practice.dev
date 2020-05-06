import { ChallengeSolvedProps, ChallengeSolvedEntity } from '../entities';
import { createTransaction } from '../lib';
import { CommitOptions } from '../orm/Transaction';
import { updateUserStats } from './user';
import { updateChallengeStats } from './challenge';

export async function createChallengeSolvedCUD(
  props: ChallengeSolvedProps,
  options?: CommitOptions
) {
  const solved = new ChallengeSolvedEntity(props);
  const t = createTransaction();
  t.insert(solved, {
    conditionExpression: 'attribute_not_exists(pk)',
  });
  updateUserStats(t, solved.userId, 'solved', 1);
  updateChallengeStats(t, props.challengeId, 'solved', 1);
  await t.commit(options);
}
