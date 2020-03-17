import { registerSampleUsers } from '../seed-data';
import { resetDb, setChallengeStats } from '../helper';
import { makeAdmin } from '../../src/contracts/user/makeAdmin';
import { updateChallenge } from '../../src/contracts/challenge/updateChallenge';
import { getChallengeById } from '../../src/contracts/challenge/getChallengeById';
import { handler } from '../../src/handler';
import { getUserByToken } from '../../src/contracts/user/getUserByToken';

const userId = '1';

beforeEach(async () => {
  await resetDb();
  await registerSampleUsers();
  const user = await getUserByToken('user1_token');
  await makeAdmin(user!.id);
});

it('create and update a challenge', async () => {
  Date.now = () => 123;

  await updateChallenge({
    id: 1,
    title: 'foo',
    description: 'desc',
    detailsBundleS3Key: 'http://example.org',
    testsBundleS3Key: 'http://example.org/testsBundleS3Key',
    domain: 'frontend',
    difficulty: 'easy',
    tags: ['foo'],
    testCase: 'a',
  });

  const challenge = await getChallengeById(userId, 1);
  expect(challenge).toEqual({
    id: 1,
    title: 'foo',
    description: 'desc',
    detailsBundleS3Key: 'http://example.org',
    createdAt: new Date(123).toISOString(),
    isSolved: false,
    domain: 'frontend',
    difficulty: 'easy',
    tags: ['foo'],
    testCase: 'a',
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
    detailsBundleS3Key: 'http://example2.org',
    testsBundleS3Key: 'http://example.org',
    tags: ['foo', 'foo2'],
    domain: 'fullstack',
    difficulty: 'hard',
    testCase: 'b',
  });

  const challenge2 = await getChallengeById(userId, 1);
  expect(challenge2).toEqual({
    id: 1,
    title: 'bar',
    description: 'desc2',
    detailsBundleS3Key: 'http://example2.org',
    tags: ['foo', 'foo2'],
    createdAt: new Date(123).toISOString(),
    isSolved: false,
    domain: 'fullstack',
    difficulty: 'hard',
    testCase: 'b',
    stats: {
      submissions: 1,
      solutions: 2,
      solved: 3,
      likes: 4,
    },
  });
});

it('should throw error if not admin', async () => {
  await expect(
    handler('challenge.updateChallenge', [], 'user2_token')
  ).rejects.toThrow('Admin only');
});
