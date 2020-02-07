import { resetDb } from '../helper';
import { registerSampleUsers, addSampleChallenges } from '../seed-data';
import { searchSolved } from '../../src/contracts/challenge/searchSolved';
import { markSolved } from '../../src/contracts/challenge/markSolved';

beforeEach(async () => {
  await resetDb();
  await Promise.all([registerSampleUsers(), addSampleChallenges()]);
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
});
