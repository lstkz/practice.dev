import { resetDb } from '../helper';
import { registerSampleUsers, addSampleChallenges } from '../seed-data';
import { _createSolution } from '../../src/contracts/solution/_createSolution';
import { getSolutionBySlug } from '../../src/contracts/solution/getSolutionBySlug';
import { voteSolution } from '../../src/contracts/solution/voteSolution';

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

  await _createSolution({
    ...sampleValues,
    id: '1',
  });
});

it('throw error if solution not found', async () => {
  await expect(
    getSolutionBySlug(undefined, 234, '123')
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"ContractError: Solution not found"`
  );
});

it('get solution anonymous', async () => {
  const solution = await getSolutionBySlug(undefined, 1, 's1');

  expect(solution.id).toEqual('1');
});

it('get solution', async () => {
  const solution = await getSolutionBySlug('1', 1, 's1');

  expect(solution.id).toEqual('1');
  expect(solution.isLiked).toEqual(false);
  await voteSolution('1', { like: true, solutionId: '1' });

  const solution2 = await getSolutionBySlug('1', 1, 's1');
  expect(solution2.isLiked).toEqual(true);
});
