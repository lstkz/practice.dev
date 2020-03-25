import { resetDb } from '../helper';
import { registerSampleUsers, addSampleChallenges } from '../seed-data';
import { _createSolution } from '../../src/contracts/solution/_createSolution';
import { getSolutionById } from '../../src/contracts/solution/getSolutionById';
import { searchSolutions } from '../../src/contracts/solution/searchSolutions';
import { removeSolution } from '../../src/contracts/solution/removeSolution';
import { MockStream } from '../MockStream';

const userId = '1';

const mockStream = new MockStream();

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
  await mockStream.process();
  expect(getSolutionById(userId, 'id')).rejects.toThrowError();

  // main index
  const { items } = await searchSolutions(undefined, {
    challengeId: 1,
    tags: [],
    limit: 10,
    sortBy: 'date',
    sortDesc: false,
  });
  expect(items).toEqual([]);

  // by username
  const { items: items2 } = await searchSolutions(undefined, {
    username: 'user1',
    challengeId: 1,
    tags: [],
    limit: 10,
    sortBy: 'date',
    sortDesc: false,
  });
  expect(items2).toEqual([]);

  // by tags
  const { items: items3 } = await searchSolutions(undefined, {
    challengeId: 1,
    tags: ['a'],
    limit: 10,
    sortBy: 'date',
    sortDesc: false,
  });
  expect(items3).toEqual([]);
});
