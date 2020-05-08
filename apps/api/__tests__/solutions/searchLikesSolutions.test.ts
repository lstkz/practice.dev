import { registerSampleUsers, addSampleChallenges } from '../seed-data';
import { resetDb, mapToTimestamps, esReIndexFromDynamo } from '../helper';
import { SolutionVoteEntity } from '../../src/entities';
import { createSolutionCUD } from '../../src/cud/solution';
import { createSolutionVoteCUD } from '../../src/cud/solutionVote';
import { searchLikesSolutions } from '../../src/contracts/solution/searchLikesSolutions';

beforeEach(async () => {
  await resetDb();
  await Promise.all([registerSampleUsers(), addSampleChallenges()]);
  const getBaseProps = (id: number) => ({
    solutionId: String(id),
    createdAt: id,
    title: 's' + id,
    slug: 's' + id,
    url: 'url',
  });

  await Promise.all([
    createSolutionCUD({
      ...getBaseProps(1),
      likes: 0,
      tags: ['a', 'b', 'c', 'd'],
      userId: '1',
      challengeId: 1,
    }),
    createSolutionCUD({
      ...getBaseProps(2),
      likes: 14,
      tags: ['a', 'b', 'c', 'd'],
      userId: '1',
      challengeId: 1,
    }),
    createSolutionCUD({
      ...getBaseProps(3),
      likes: 5,
      tags: ['a', 'b', 'd'],
      userId: '1',
      challengeId: 1,
    }),
  ]);
  await Promise.all([
    createSolutionVoteCUD({
      solutionId: '1',
      userId: '1',
      challengeId: 1,
      createdAt: 1,
    }),
    createSolutionVoteCUD({
      solutionId: '2',
      userId: '1',
      challengeId: 1,
      createdAt: 2,
    }),
    createSolutionVoteCUD({
      solutionId: '1',
      userId: '2',
      challengeId: 1,
      createdAt: 3,
    }),
  ]);
  await esReIndexFromDynamo(SolutionVoteEntity.entityType);
});

it('search likes solutions', async () => {
  const { items } = await searchLikesSolutions(undefined, {
    username: 'user1',
  });

  expect(mapToTimestamps(items)).toEqual([2, 1]);
});

it('return empty for unknown user', async () => {
  const { items } = await searchLikesSolutions(undefined, {
    username: 'user14433',
  });

  expect(mapToTimestamps(items)).toEqual([]);
});

it('search with pagination', async () => {
  const { items, cursor } = await searchLikesSolutions(undefined, {
    username: 'user1',
    limit: 1,
  });

  expect(mapToTimestamps(items)).toEqual([2]);

  const { items: items2 } = await searchLikesSolutions(undefined, {
    username: 'user1',
    limit: 1,
    cursor,
  });
  expect(mapToTimestamps(items2)).toEqual([1]);
});

it('should populate isLiked', async () => {
  const { items } = await searchLikesSolutions('2', {
    username: 'user1',
  });
  expect(items[0].isLiked).toEqual(false);
  expect(items[1].isLiked).toEqual(true);
});
