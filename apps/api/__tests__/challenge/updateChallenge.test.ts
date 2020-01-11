import { registerSampleUsers } from '../seed-data';
import { resetDb, setChallengeStats } from '../helper';
import { makeAdmin } from '../../src/contracts/user/makeAdmin';
import { updateChallenge } from '../../src/contracts/challenge/updateChallenge';
import { getChallengeById } from '../../src/contracts/challenge/getChallengeById';
import { getDbUserByToken } from '../../src/contracts/user/getDbUserByToken';
import { runWithContext } from '../../src/lib';
import { DbUser } from '../../src/types';
import { handler } from '../../src/handler';

let user: DbUser | null;

beforeEach(async () => {
  await resetDb();
  await registerSampleUsers();
  user = await getDbUserByToken('user1_token');
  await makeAdmin(user!.userId);
  user!.isAdmin = true;
});

it('create and update a challenge', async () => {
  Date.now = () => 123;

  await runWithContext(
    {
      user,
    },
    async () => {
      await updateChallenge({
        id: 1,
        title: 'foo',
        description: 'desc',
        bundle: 'http://example.org',
        tests: 'http://example.org/tests',
        domain: 'frontend',
        difficulty: 'easy',
        tags: ['foo'],
      });

      const challenge = await getChallengeById(1);
      expect(challenge).toEqual({
        id: 1,
        title: 'foo',
        description: 'desc',
        bundle: 'http://example.org',
        createdAt: new Date(123).toISOString(),
        isSolved: false,
        domain: 'frontend',
        difficulty: 'easy',
        tags: ['foo'],
        stats: {
          submissions: 0,
          solutions: 0,
          solved: 0,
          likes: 0,
        },
      });

      // update stats
      await setChallengeStats(1, {
        submissions: 1,
        solutions: 2,
        solved: 3,
        likes: 4,
      });

      await updateChallenge({
        id: 1,
        title: 'bar',
        description: 'desc2',
        bundle: 'http://example2.org',
        tests: 'http://example.org',
        tags: ['foo', 'foo2'],
        domain: 'fullstack',
        difficulty: 'hard',
      });

      const challenge2 = await getChallengeById(1);
      expect(challenge2).toEqual({
        id: 1,
        title: 'bar',
        description: 'desc2',
        bundle: 'http://example2.org',
        tags: ['foo', 'foo2'],
        createdAt: new Date(123).toISOString(),
        isSolved: false,
        domain: 'fullstack',
        difficulty: 'hard',
        stats: {
          submissions: 1,
          solutions: 2,
          solved: 3,
          likes: 4,
        },
      });
    }
  );
});

it('should throw error if not admin', async () => {
  await expect(
    handler('challenge.updateChallenge', [], 'user2_token')
  ).rejects.toThrow('Admin only');
});
