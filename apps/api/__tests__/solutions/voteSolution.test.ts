import { registerSampleUsers, addSampleChallenges } from '../seed-data';
import { resetDb } from '../helper';
import { _createSolution } from '../../src/contracts/solution/_createSolution';
import { voteSolution } from '../../src/contracts/solution/voteSolution';

beforeEach(async () => {
  await resetDb();
  await Promise.all([registerSampleUsers(), addSampleChallenges()]);

  await _createSolution({
    id: '1',
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
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"ContractError: Solution not found"`
  );
});

it('should like and unlike solution', async () => {
  let likes = 0;

  // 0 -> 1 likes
  expect(
    await voteSolution('1', {
      solutionId: '1',
      like: true,
    })
  ).toEqual(1);

  // double like, ignore
  expect(
    await voteSolution('1', {
      solutionId: '1',
      like: true,
    })
  ).toEqual(1);

  // like as another user
  expect(
    await voteSolution('2', {
      solutionId: '1',
      like: true,
    })
  ).toEqual(2);

  // unlike as user1
  likes = await voteSolution('1', {
    solutionId: '1',
    like: false,
  });
  expect(likes).toEqual(1);

  // unlike again as user1, ignore
  likes = await voteSolution('1', {
    solutionId: '1',
    like: false,
  });
  expect(likes).toEqual(1);
});
