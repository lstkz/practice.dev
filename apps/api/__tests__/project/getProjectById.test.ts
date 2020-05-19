import { resetDb } from '../helper';
import { registerSampleUsers, addSampleProjects } from '../seed-data';
import { getProjectById } from '../../src/contracts/project/getProjectById';
import { createProjectChallengeSolvedCUD } from '../../src/cud/projectChallengeSolved';

const userId = '1';

beforeEach(async () => {
  Date.now = () => 123;
  await resetDb();
  await Promise.all([registerSampleUsers(), addSampleProjects()]);
});

it('throw error if not found', async () => {
  await expect(getProjectById(userId, 123)).rejects.toThrow(
    'Project not found'
  );
});

it('should project as anonymous', async () => {
  await expect(await getProjectById(undefined, 1)).toMatchInlineSnapshot(`
          Object {
            "createdAt": "1970-01-01T00:00:00.123Z",
            "description": "foo",
            "domain": "frontend",
            "id": 1,
            "solvedPercent": 0,
            "stats": Object {},
            "title": "foo",
          }
        `);
});

it('should project as logged in', async () => {
  await expect(await getProjectById(userId, 1)).toMatchInlineSnapshot(`
          Object {
            "createdAt": "1970-01-01T00:00:00.123Z",
            "description": "foo",
            "domain": "frontend",
            "id": 1,
            "solvedPercent": 0,
            "stats": Object {},
            "title": "foo",
          }
        `);
});

it('should project with progress', async () => {
  await Promise.all([
    createProjectChallengeSolvedCUD({
      challengeId: 1,
      projectId: 1,
      solvedAt: 1,
      userId,
    }),
    createProjectChallengeSolvedCUD({
      challengeId: 2,
      projectId: 1,
      solvedAt: 1,
      userId,
    }),
  ]);
  await expect((await getProjectById(userId, 1)).solvedPercent).toBe(
    (2 / 3) * 100
  );
});
