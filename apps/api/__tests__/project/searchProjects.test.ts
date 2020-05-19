import { resetDb, setProjectStats } from '../helper';
import { registerSampleUsers, addSampleProjects } from '../seed-data';
import { PagedResult, Project } from 'shared';
import { searchProjects } from '../../src/contracts/project/searchProjects';
import { createProjectChallengeSolvedCUD } from '../../src/cud/projectChallengeSolved';

const userId = '1';

beforeEach(async () => {
  await resetDb();
  await Promise.all([registerSampleUsers(), addSampleProjects()]);
  await Promise.all([
    // solved: 12
    // submissions: 100
    setProjectStats(1, {
      solved_1: 6,
      submissions_1: 10,
      solved_2: 3,
      submissions_2: 20,
      solved_3: 3,
      submissions_3: 70,
    }),
    // solved: 50
    // submissions: 70
    setProjectStats(3, {
      solved_1: 50,
      submissions_1: 70,
    }),
  ]);
});

function fixResponse(result: PagedResult<Project>) {
  return {
    ...result,
    items: result.items.map(x => x.id),
  };
}

it('should return all projects', async () => {
  const result = await searchProjects(userId, {});
  expect(fixResponse(result)).toEqual({
    items: [1, 2, 3],
    pageNumber: 0,
    pageSize: 30,
    total: 3,
    totalPages: 1,
  });
});

it('should return all projects DESC', async () => {
  const result = await searchProjects(userId, {
    sortOrder: 'desc',
  });
  expect(fixResponse(result)).toEqual({
    items: [3, 2, 1],
    pageNumber: 0,
    pageSize: 30,
    total: 3,
    totalPages: 1,
  });
});

it('sort by solved', async () => {
  const result = await searchProjects(userId, {
    sortOrder: 'desc',
    sortBy: 'solved',
  });
  expect(fixResponse(result)).toEqual({
    items: [3, 1, 2],
    pageNumber: 0,
    pageSize: 30,
    total: 3,
    totalPages: 1,
  });
});

it('sort by submissions', async () => {
  const result = await searchProjects(userId, {
    sortOrder: 'desc',
    sortBy: 'submissions',
  });
  expect(fixResponse(result)).toEqual({
    items: [1, 3, 2],
    pageNumber: 0,
    pageSize: 30,
    total: 3,
    totalPages: 1,
  });
});

it('should return all projects with pagination', async () => {
  const result = await searchProjects(userId, {
    pageSize: 1,
    pageNumber: 1,
  });
  expect(fixResponse(result)).toEqual({
    items: [2],
    pageNumber: 1,
    pageSize: 1,
    total: 3,
    totalPages: 3,
  });
});

it('filter by solved', async () => {
  await Promise.all([
    createProjectChallengeSolvedCUD({
      challengeId: 1,
      projectId: 2,
      solvedAt: 1,
      userId,
    }),
    createProjectChallengeSolvedCUD({
      challengeId: 2,
      projectId: 2,
      solvedAt: 1,
      userId,
    }),
  ]);
  const result = await searchProjects(userId, {
    statuses: ['solved'],
  });
  expect(fixResponse(result)).toEqual({
    items: [2],
    pageNumber: 0,
    pageSize: 30,
    total: 1,
    totalPages: 1,
  });
  expect(result.items[0].solvedPercent).toEqual(100);
});

it('filter by unsolved', async () => {
  await Promise.all([
    createProjectChallengeSolvedCUD({
      challengeId: 1,
      projectId: 2,
      solvedAt: 1,
      userId,
    }),
    createProjectChallengeSolvedCUD({
      challengeId: 2,
      projectId: 2,
      solvedAt: 1,
      userId,
    }),
  ]);
  const result = await searchProjects(userId, {
    statuses: ['unsolved'],
  });
  expect(fixResponse(result)).toEqual({
    items: [1, 3],
    pageNumber: 0,
    pageSize: 30,
    total: 2,
    totalPages: 1,
  });
});

it('filter by partially solved', async () => {
  await Promise.all([
    createProjectChallengeSolvedCUD({
      challengeId: 1,
      projectId: 1,
      solvedAt: 1,
      userId,
    }),
  ]);
  const result = await searchProjects(userId, {
    statuses: ['partial'],
  });
  expect(fixResponse(result)).toEqual({
    items: [1],
    pageNumber: 0,
    pageSize: 30,
    total: 1,
    totalPages: 1,
  });
});
