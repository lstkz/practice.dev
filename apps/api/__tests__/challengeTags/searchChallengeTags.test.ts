import { _createSolution } from '../../src/contracts/solution/_createSolution';
import { resetDb } from '../helper';
import { registerSampleUsers, addSampleChallenges } from '../seed-data';
import { searchChallengeTags } from '../../src/contracts/challengeTag/searchChallengeTags';
import { removeSolution } from '../../src/contracts/solution/removeSolution';
import { updateSolution } from '../../src/contracts/solution/updateSolution';
import { MockStream } from '../MockStream';

const userId = '1';

const mockStream = new MockStream();

const getBaseProps = (id: number) => ({
  id: String(id),
  createdAt: id,
  title: 's' + id,
  slug: 's' + id,
  url: 'https://github.com/foo/a',
});

beforeAll(async () => {
  await mockStream.prepare();
});

beforeEach(async () => {
  await resetDb();
  await mockStream.init();
  await Promise.all([registerSampleUsers(), addSampleChallenges()]);
  await Promise.all([
    _createSolution({
      ...getBaseProps(1),
      likes: 25,
      tags: ['a', 'ab', 'c', 'd'],
      userId: '1',
      challengeId: 1,
    }),
    _createSolution({
      ...getBaseProps(2),
      likes: 25,
      tags: ['a', 'ab'],
      userId: '2',
      challengeId: 1,
    }),
    _createSolution({
      ...getBaseProps(3),
      likes: 0,
      tags: ['a'],
      userId: '1',
      challengeId: 2,
    }),
  ]);
  await mockStream.process();
});

it('return tags for challenge 1', async () => {
  const { items } = await searchChallengeTags({
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
  const { items, cursor } = await searchChallengeTags({
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
  const { items: items2 } = await searchChallengeTags({
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
  const { items } = await searchChallengeTags({
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
  const { items } = await searchChallengeTags({
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
  const { items } = await searchChallengeTags({
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
  await mockStream.process();
  const { items } = await searchChallengeTags({
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
  await mockStream.process();
  const { items } = await searchChallengeTags({
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
