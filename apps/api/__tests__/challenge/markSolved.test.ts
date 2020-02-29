import { resetDb } from '../helper';
import { registerSampleUsers, addSampleChallenges } from '../seed-data';
import { searchSolved } from '../../src/contracts/challenge/searchSolved';
import { markSolved } from '../../src/contracts/challenge/markSolved';
import { getChallengeById } from '../../src/contracts/challenge/getChallengeById';
import { MockStream } from '../MockStream';

const mockStream = new MockStream();

beforeEach(async () => {
  await resetDb();
  await mockStream.init();
  await Promise.all([registerSampleUsers(), addSampleChallenges()]);
  await mockStream.process();
});

it('mark as solved and ignore additional solved', async () => {
  const ret = await searchSolved({
    username: 'user1',
    limit: 10,
  });
  expect(ret.items).toHaveLength(0);

  await markSolved({
    userId: '1',
    challengeId: 2,
    solvedAt: 10,
  });
  await mockStream.process();

  let challenge = await getChallengeById('1', 2);
  expect(challenge.isSolved).toEqual(true);
  expect(challenge.stats.solved).toEqual(1);

  const ret2 = await searchSolved({
    username: 'user1',
    limit: 10,
  });
  expect(ret2.items).toEqual([
    {
      challengeId: 2,
      solvedAt: 10,
      user: {
        id: '1',
        username: 'user1',
      },
    },
  ]);

  await markSolved({
    userId: '1',
    challengeId: 2,
    solvedAt: 1230,
  });
  await mockStream.process();

  const ret3 = await searchSolved({
    username: 'user1',
    limit: 10,
  });
  expect(ret3.items).toEqual([
    {
      challengeId: 2,
      solvedAt: 10,
      user: {
        id: '1',
        username: 'user1',
      },
    },
  ]);

  challenge = await getChallengeById('1', 2);
  expect(challenge.isSolved).toEqual(true);
  expect(challenge.stats.solved).toEqual(1);
});
