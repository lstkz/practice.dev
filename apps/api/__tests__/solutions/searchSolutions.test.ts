import { registerSampleUsers, addSampleChallenges } from '../seed-data';
import { resetDb, mapToTimestamps } from '../helper';
import { searchSolutions } from '../../src/contracts/solution/searchSolutions';
import { voteSolution } from '../../src/contracts/solution/voteSolution';
import { SolutionEntity } from '../../src/entities';
import { exIndexBulk, esClearIndex } from '../../src/common/elastic';
import { createSolutionCUD } from '../../src/cud/solution';

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

  await esClearIndex(SolutionEntity.entityType);
  const solutions = [
    new SolutionEntity({
      ...getBaseProps(1),
      likes: 25,
      tags: ['a', 'b', 'c', 'd'],
      userId: '1',
      challengeId: 1,
    }),
    new SolutionEntity({
      ...getBaseProps(2),
      likes: 14,
      tags: ['a', 'b', 'c', 'd'],
      userId: '1',
      challengeId: 1,
    }),
    new SolutionEntity({
      ...getBaseProps(3),
      likes: 5,
      tags: ['a', 'b', 'd'],
      userId: '1',
      challengeId: 1,
    }),
    new SolutionEntity({
      ...getBaseProps(4),
      likes: 0,
      tags: ['d'],
      userId: '1',
      challengeId: 2,
    }),
    new SolutionEntity({
      ...getBaseProps(5),
      likes: 1,
      tags: ['e'],
      userId: '1',
      challengeId: 3,
    }),
    new SolutionEntity({
      ...getBaseProps(6),
      likes: 30,
      tags: ['a'],
      userId: '2',
      challengeId: 1,
    }),
  ];
  await Promise.all<any>([
    exIndexBulk(
      solutions.map(item => ({
        type: 'index',
        entity: item.serialize() as any,
      }))
    ),
    ...solutions.map(item => createSolutionCUD(item.getProps())),
  ]);
});

it('search by challengeId sort by DATE ASC', async () => {
  const { items } = await searchSolutions(undefined, {
    challengeId: 1,
    limit: 10,
    sortBy: 'date',
    sortDesc: false,
  });

  expect(mapToTimestamps(items)).toEqual([1, 2, 3, 6]);
});

it('search by challengeId sort by DATE DESC', async () => {
  const { items } = await searchSolutions(undefined, {
    challengeId: 1,
    limit: 10,
    sortBy: 'date',
    sortDesc: true,
  });

  expect(mapToTimestamps(items)).toEqual([6, 3, 2, 1]);
});

it('search by challengeId sort by DATE ASC with pagination', async () => {
  const { items, cursor } = await searchSolutions(undefined, {
    challengeId: 1,
    limit: 2,
    sortBy: 'date',
    sortDesc: false,
  });

  expect(mapToTimestamps(items)).toEqual([1, 2]);

  const { items: items2 } = await searchSolutions(undefined, {
    challengeId: 1,
    limit: 2,
    sortBy: 'date',
    sortDesc: false,
    cursor,
  });

  expect(mapToTimestamps(items2)).toEqual([3, 6]);
});

it('search by challengeId sort by LIKES ASC', async () => {
  const { items } = await searchSolutions(undefined, {
    challengeId: 1,
    limit: 10,
    sortBy: 'likes',
    sortDesc: false,
  });

  expect(mapToTimestamps(items)).toEqual([3, 2, 1, 6]);
});

it('search by challengeId and 1 tag', async () => {
  const { items } = await searchSolutions(undefined, {
    challengeId: 1,
    tags: ['a'],
    limit: 10,
    sortBy: 'date',
    sortDesc: false,
  });

  expect(mapToTimestamps(items)).toEqual([1, 2, 3, 6]);
});

it('search by challengeId and 2 tags', async () => {
  const { items } = await searchSolutions(undefined, {
    challengeId: 1,
    tags: ['a', 'b'],
    limit: 10,
    sortBy: 'date',
    sortDesc: false,
  });

  expect(mapToTimestamps(items)).toEqual([1, 2, 3]);
});

it('search by challengeId and 3 tags', async () => {
  const { items } = await searchSolutions(undefined, {
    challengeId: 1,
    tags: ['a', 'b', 'c'],
    limit: 10,
    sortBy: 'date',
    sortDesc: false,
  });

  expect(mapToTimestamps(items)).toEqual([1, 2]);
});

it('search by username', async () => {
  const { items } = await searchSolutions(undefined, {
    username: 'user1',
    limit: 10,
    sortBy: 'date',
    sortDesc: false,
  });

  expect(mapToTimestamps(items)).toEqual([1, 2, 3, 4, 5]);
});

it('search by username and challengeId', async () => {
  const { items } = await searchSolutions(undefined, {
    username: 'user1',
    challengeId: 1,
    limit: 10,
    sortBy: 'date',
    sortDesc: false,
  });

  expect(mapToTimestamps(items)).toEqual([1, 2, 3]);
});

it('search by username and challengeId and 1 tag', async () => {
  const { items } = await searchSolutions(undefined, {
    username: 'user1',
    challengeId: 1,
    limit: 10,
    tags: ['c'],
    sortBy: 'date',
    sortDesc: false,
  });

  expect(mapToTimestamps(items)).toEqual([1, 2]);
});

it('search by username and challengeId and 2 tags', async () => {
  const { items } = await searchSolutions(undefined, {
    username: 'user1',
    challengeId: 1,
    limit: 10,
    tags: ['a', 'c'],
    sortBy: 'date',
    sortDesc: false,
  });

  expect(mapToTimestamps(items)).toEqual([1, 2]);
});

it('should populate isLiked', async () => {
  await voteSolution('1', {
    like: true,
    solutionId: '2',
  });
  const { items } = await searchSolutions('1', {
    challengeId: 1,
    limit: 10,
    sortBy: 'date',
    sortDesc: false,
  });
  expect(items[0].isLiked).toEqual(false);
  expect(items[1].isLiked).toEqual(true);
});
