import { resetDb } from '../helper';
import { registerSampleUsers, addSampleChallenges } from '../seed-data';
import { _createSolution } from '../../src/contracts/solution/_createSolution';
import { getSolutionBySlug } from '../../src/contracts/solution/getSolutionBySlug';
import { voteSolution } from '../../src/contracts/solution/voteSolution';
import { MockStream } from '../MockStream';

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

const mockStream = new MockStream();

beforeAll(async () => {
  await mockStream.prepare();
});

beforeEach(async () => {
  await resetDb();
  await mockStream.init();
  await Promise.all([registerSampleUsers(), addSampleChallenges()]);

  await _createSolution({
    ...sampleValues,
    id: '1',
  });
  await mockStream.process();
});

it('throw error if solution not found', async () => {
  await expect(
    getSolutionBySlug(undefined, 234, '123')
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"Solution not found"`);
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
  await mockStream.init();

  const solution2 = await getSolutionBySlug('1', 1, 's1');
  expect(solution2.isLiked).toEqual(true);
});
