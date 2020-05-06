import { resetDb, esReIndexFromDynamo } from '../helper';
import { registerSampleUsers, addSampleChallenges } from '../seed-data';
import { searchSolutionTags } from '../../src/contracts/solutionTag/searchSolutionTags';
import { removeSolution } from '../../src/contracts/solution/removeSolution';
import { updateSolution } from '../../src/contracts/solution/updateSolution';
import { SolutionTagStatsEntity } from '../../src/entities';
import { createSolutionCUD } from '../../src/cud/solution';

const userId = '1';

const getBaseProps = (id: number) => ({
  solutionId: String(id),
  createdAt: id,
  title: 's' + id,
  slug: 's' + id,
  url: 'https://github.com/foo/a',
});

beforeEach(async () => {
  await resetDb();
  await Promise.all([registerSampleUsers(), addSampleChallenges()]);

  await Promise.all([
    createSolutionCUD({
      ...getBaseProps(1),
      likes: 25,
      tags: ['a', 'ab', 'c', 'd'],
      userId: '1',
      challengeId: 1,
    }),
    createSolutionCUD({
      ...getBaseProps(2),
      likes: 25,
      tags: ['a', 'ab'],
      userId: '2',
      challengeId: 1,
    }),
    createSolutionCUD({
      ...getBaseProps(3),
      likes: 0,
      tags: ['a'],
      userId: '1',
      challengeId: 2,
    }),
  ]);
  await esReIndexFromDynamo(SolutionTagStatsEntity.entityType);
});

it('return tags for challenge 1', async () => {
  const { items } = await searchSolutionTags({
    challengeId: 1,
  });
  expect(items).toMatchInlineSnapshot(`
    Array [
      Object {
        "count": 2,
        "name": "a",
      },
      Object {
        "count": 2,
        "name": "ab",
      },
      Object {
        "count": 1,
        "name": "c",
      },
      Object {
        "count": 1,
        "name": "d",
      },
    ]
  `);
});

it('return tags for challenge 1 with pagination', async () => {
  const { items, cursor } = await searchSolutionTags({
    challengeId: 1,
    limit: 2,
  });
  expect(items).toMatchInlineSnapshot(`
    Array [
      Object {
        "count": 2,
        "name": "a",
      },
      Object {
        "count": 2,
        "name": "ab",
      },
    ]
  `);
  const { items: items2 } = await searchSolutionTags({
    challengeId: 1,
    cursor,
    limit: 2,
  });
  expect(items2).toMatchInlineSnapshot(`
    Array [
      Object {
        "count": 1,
        "name": "c",
      },
      Object {
        "count": 1,
        "name": "d",
      },
    ]
  `);
});

it('return tags for challenge 1 with "a" keyword', async () => {
  const { items } = await searchSolutionTags({
    challengeId: 1,
    keyword: 'a',
  });
  expect(items).toMatchInlineSnapshot(`
    Array [
      Object {
        "count": 2,
        "name": "a",
      },
      Object {
        "count": 2,
        "name": "ab",
      },
    ]
  `);
});

it('return tags for challenge 1 with "ab" keyword', async () => {
  const { items } = await searchSolutionTags({
    challengeId: 1,
    keyword: 'ab',
  });
  expect(items).toMatchInlineSnapshot(`
    Array [
      Object {
        "count": 2,
        "name": "ab",
      },
    ]
  `);
});

it('return tags for challenge 2', async () => {
  const { items } = await searchSolutionTags({
    challengeId: 2,
  });
  expect(items).toMatchInlineSnapshot(`
    Array [
      Object {
        "count": 1,
        "name": "a",
      },
    ]
  `);
});

it('remove solution', async () => {
  await removeSolution(userId, '1');
  await esReIndexFromDynamo(SolutionTagStatsEntity.entityType);
  const { items } = await searchSolutionTags({
    challengeId: 1,
  });
  expect(items).toMatchInlineSnapshot(`
    Array [
      Object {
        "count": 1,
        "name": "a",
      },
      Object {
        "count": 1,
        "name": "ab",
      },
    ]
  `);
});

it('update solution', async () => {
  const solutionId = '1';
  await updateSolution(userId, solutionId, {
    title: 's' + solutionId,
    slug: 's' + solutionId,
    url: 'https://github.com/foo/a',
    tags: ['a', 'e', 'f'],
  });
  await esReIndexFromDynamo(SolutionTagStatsEntity.entityType);
  const { items } = await searchSolutionTags({
    challengeId: 1,
  });
  expect(items).toMatchInlineSnapshot(`
    Array [
      Object {
        "count": 2,
        "name": "a",
      },
      Object {
        "count": 1,
        "name": "ab",
      },
      Object {
        "count": 1,
        "name": "e",
      },
      Object {
        "count": 1,
        "name": "f",
      },
    ]
  `);
});
