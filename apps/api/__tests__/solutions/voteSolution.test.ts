import { registerSampleUsers, addSampleChallenges } from '../seed-data';
import { resetDb } from '../helper';
import { voteSolution } from '../../src/contracts/solution/voteSolution';
import { getSolutionById } from '../../src/contracts/solution/getSolutionById';
import { createSolutionCUD } from '../../src/cud/solution';

beforeEach(async () => {
  await resetDb();
  await Promise.all([registerSampleUsers(), addSampleChallenges()]);

  await createSolutionCUD({
    solutionId: '1',
    createdAt: 1,
    title: 'solution',
    slug: 's1',
    url: 'url',
    likes: 0,
    tags: ['a', 'b', 'c', 'd'],
    userId: '1',
    challengeId: 1,
  });
});

it('throw error if solution not found', async () => {
  await expect(
    voteSolution('1', {
      like: true,
      solutionId: '123',
    })
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"Solution not found"`);
});

it('should like and unlike solution', async () => {
  const getLikes = async () => {
    const solution = await getSolutionById('1', '1');
    return solution.likes;
  };

  await voteSolution('1', {
    solutionId: '1',
    like: true,
  });
  expect(await getLikes()).toEqual(1);

  // double like, ignore
  await voteSolution('1', {
    solutionId: '1',
    like: true,
  });
  expect(await getLikes()).toEqual(1);

  // like as another user

  await voteSolution('2', {
    solutionId: '1',
    like: true,
  });
  expect(await getLikes()).toEqual(2);

  // unlike as user1
  await voteSolution('1', {
    solutionId: '1',
    like: false,
  });
  expect(await getLikes()).toEqual(1);

  // unlike again as user1, ignore
  await voteSolution('1', {
    solutionId: '1',
    like: false,
  });
  expect(await getLikes()).toEqual(1);
});
