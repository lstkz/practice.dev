import { resetDb } from '../helper';
import { registerSampleUsers, addSampleChallenges } from '../seed-data';
import { getChallengeById } from '../../src/contracts/challenge/getChallengeById';
import { createChallengeSolvedCUD } from '../../src/cud/challengeSolved';

beforeEach(async () => {
  await resetDb();
  await Promise.all([registerSampleUsers(), addSampleChallenges()]);
});

it('mark as solved', async () => {
  let challenge = await getChallengeById('1', 2);
  expect(challenge.isSolved).toEqual(false);
  expect(challenge.stats.solved).toEqual(0);
  await createChallengeSolvedCUD({
    userId: '1',
    challengeId: 2,
    solvedAt: 10,
  });

  challenge = await getChallengeById('1', 2);
  expect(challenge.isSolved).toEqual(true);
  expect(challenge.stats.solved).toEqual(1);
});
