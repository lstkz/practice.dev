import { resetDb, mapToTimestamps } from '../helper';
import { registerSampleUsers, addSampleChallenges } from '../seed-data';
import { _createSolution } from '../../src/contracts/solution/_createSolution';
import { updateSolution } from '../../src/contracts/solution/updateSolution';
import { getSolutionById } from '../../src/contracts/solution/getSolutionById';
import { searchSolutions } from '../../src/contracts/solution/searchSolutions';
import { MockStream } from '../MockStream';

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

const mockStream = new MockStream();

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
    updateSolution(userId, '123', {
      slug: 's1',
      tags: ['a', 'b', 'c', 'd'],
      title: 'solution-edited',
      description: 'desc-edited',
      url: 'https://github.com/repo-edited',
    })
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"Solution not found"`);
});

it('throw error if not author', async () => {
  await expect(
    updateSolution('2', '1', {
      slug: 's1',
      tags: ['a', 'b', 'c', 'd'],
      title: 'solution-edited',
      description: 'desc-edited',
      url: 'https://github.com/repo-edited',
    })
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"No Permissions"`);
});

it('update basic props', async () => {
  const ret = await updateSolution(userId, '1', {
    slug: 's1',
    tags: ['a', 'b', 'c', 'd'],
    title: 'solution-edited',
    description: 'desc-edited',
    url: 'https://github.com/repo-edited',
  });
  expect(ret.slug).toEqual('s1');
  expect(ret.title).toEqual('solution-edited');
  expect(ret.description).toEqual('desc-edited');
  expect(ret.url).toEqual('https://github.com/repo-edited');
  const latest = await getSolutionById(userId, '1');
  expect(latest.slug).toEqual('s1');
  expect(latest.title).toEqual('solution-edited');
  expect(latest.description).toEqual('desc-edited');
  expect(latest.url).toEqual('https://github.com/repo-edited');
});

it('change slug', async () => {
  const ret = await updateSolution(userId, '1', {
    slug: 'new-slug',
    tags: ['a', 'b', 'c', 'd'],
    title: 'solution-edited',
    description: 'desc-edited',
    url: 'https://github.com/repo-edited',
  });
  expect(ret.slug).toEqual('new-slug');
  await mockStream.process();

  // new slug should be reserved
  await expect(
    _createSolution({
      id: '2',
      ...sampleValues,
      slug: 'new-slug',
    })
  ).rejects.toThrow('Duplicated slug for this challenge');

  // new old slug should be reserved
  await expect(
    _createSolution({
      id: '3',
      ...sampleValues,
    })
  ).resolves.not.toThrow();
});

it('add tag', async () => {
  const ret = await updateSolution(userId, '1', {
    slug: 's1',
    tags: ['a', 'b', 'c', 'd', 'x'],
    title: 'solution-edited',
    description: 'desc-edited',
    url: 'https://github.com/repo-edited',
  });
  expect(ret.tags).toEqual(['a', 'b', 'c', 'd', 'x']);
  await mockStream.process();
  const { items } = await searchSolutions(undefined, {
    challengeId: 1,
    tags: ['x'],
    limit: 10,
    sortBy: 'date',
    sortDesc: false,
  });
  expect(mapToTimestamps(items)).toEqual([1]);
});

it('remove tag', async () => {
  const ret = await updateSolution(userId, '1', {
    slug: 's1',
    tags: ['a', 'b'],
    title: 'solution-edited',
    description: 'desc-edited',
    url: 'https://github.com/repo-edited',
  });
  await mockStream.process();
  expect(ret.tags).toEqual(['a', 'b']);
  const { items } = await searchSolutions(undefined, {
    challengeId: 1,
    tags: ['c'],
    limit: 10,
    sortBy: 'date',
    sortDesc: false,
  });
  expect(mapToTimestamps(items)).toEqual([]);
});
