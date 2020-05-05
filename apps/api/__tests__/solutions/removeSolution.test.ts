import { resetDb } from '../helper';
import { registerSampleUsers, addSampleChallenges } from '../seed-data';
import { getSolutionById } from '../../src/contracts/solution/getSolutionById';
import { removeSolution } from '../../src/contracts/solution/removeSolution';
import { createSolutionCUD } from '../../src/cud/solution';

const userId = '1';

const sampleValues = {
  createdAt: 1,
  title: 'solution',
  description: 'desc',
  slug: 's1',
  url: 'https://github.com/repo',
  likes: 0,
  tags: ['a', 'b', 'c', 'd'],
  userId: '1',
  challengeId: 1,
};

beforeEach(async () => {
  await resetDb();
  await Promise.all([registerSampleUsers(), addSampleChallenges()]);
  await createSolutionCUD({
    ...sampleValues,
    solutionId: '1',
  });
});

it('throw error if solution not found', async () => {
  await expect(
    removeSolution(userId, '123')
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"Solution not found"`);
});

it('throw error if not author', async () => {
  await expect(
    removeSolution('2', '1')
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"No Permissions"`);
});

it('remove solution', async () => {
  await removeSolution(userId, '1');
  expect(getSolutionById(userId, 'id')).rejects.toThrowError();
});
