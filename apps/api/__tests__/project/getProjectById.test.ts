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

it('should return a project as anonymous', async () => {
  await expect(await getProjectById(undefined, 1)).toMatchInlineSnapshot(`
          Object {
            "challenges": Array [
              Object {
                "assets": null,
                "createdAt": "1970-01-01T00:00:00.123Z",
                "description": "foo1",
                "detailsBundleS3Key": "http://example.org",
                "id": 1,
                "isLocked": false,
                "isSolved": false,
                "project": Object {
                  "id": 1,
                  "title": "foo",
                },
                "stats": Object {
                  "solved": 0,
                  "submissions": 0,
                },
                "testCase": "a",
                "title": "foo1",
              },
              Object {
                "assets": Object {},
                "createdAt": "1970-01-01T00:00:00.123Z",
                "description": "",
                "detailsBundleS3Key": "",
                "id": 2,
                "isLocked": true,
                "isSolved": false,
                "project": Object {
                  "id": 1,
                  "title": "foo",
                },
                "stats": Object {
                  "solved": 0,
                  "submissions": 0,
                },
                "testCase": "",
                "title": "",
              },
              Object {
                "assets": Object {},
                "createdAt": "1970-01-01T00:00:00.123Z",
                "description": "",
                "detailsBundleS3Key": "",
                "id": 3,
                "isLocked": true,
                "isSolved": false,
                "project": Object {
                  "id": 1,
                  "title": "foo",
                },
                "stats": Object {
                  "solved": 0,
                  "submissions": 0,
                },
                "testCase": "",
                "title": "",
              },
            ],
            "project": Object {
              "createdAt": "1970-01-01T00:00:00.123Z",
              "description": "foo",
              "domain": "frontend",
              "id": 1,
              "solvedPercent": 0,
              "stats": Object {},
              "title": "foo",
            },
          }
        `);
});

it('should return a project as logged in', async () => {
  await expect(await getProjectById(userId, 1)).toMatchInlineSnapshot(`
          Object {
            "challenges": Array [
              Object {
                "assets": null,
                "createdAt": "1970-01-01T00:00:00.123Z",
                "description": "foo1",
                "detailsBundleS3Key": "http://example.org",
                "id": 1,
                "isLocked": false,
                "isSolved": false,
                "project": Object {
                  "id": 1,
                  "title": "foo",
                },
                "stats": Object {
                  "solved": 0,
                  "submissions": 0,
                },
                "testCase": "a",
                "title": "foo1",
              },
              Object {
                "assets": Object {},
                "createdAt": "1970-01-01T00:00:00.123Z",
                "description": "",
                "detailsBundleS3Key": "",
                "id": 2,
                "isLocked": true,
                "isSolved": false,
                "project": Object {
                  "id": 1,
                  "title": "foo",
                },
                "stats": Object {
                  "solved": 0,
                  "submissions": 0,
                },
                "testCase": "",
                "title": "",
              },
              Object {
                "assets": Object {},
                "createdAt": "1970-01-01T00:00:00.123Z",
                "description": "",
                "detailsBundleS3Key": "",
                "id": 3,
                "isLocked": true,
                "isSolved": false,
                "project": Object {
                  "id": 1,
                  "title": "foo",
                },
                "stats": Object {
                  "solved": 0,
                  "submissions": 0,
                },
                "testCase": "",
                "title": "",
              },
            ],
            "project": Object {
              "createdAt": "1970-01-01T00:00:00.123Z",
              "description": "foo",
              "domain": "frontend",
              "id": 1,
              "solvedPercent": 0,
              "stats": Object {},
              "title": "foo",
            },
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
  await expect(await getProjectById(userId, 1)).toMatchInlineSnapshot(`
          Object {
            "challenges": Array [
              Object {
                "assets": null,
                "createdAt": "1970-01-01T00:00:00.123Z",
                "description": "foo1",
                "detailsBundleS3Key": "http://example.org",
                "id": 1,
                "isLocked": false,
                "isSolved": true,
                "project": Object {
                  "id": 1,
                  "title": "foo",
                },
                "stats": Object {
                  "solved": 1,
                  "submissions": 0,
                },
                "testCase": "a",
                "title": "foo1",
              },
              Object {
                "assets": null,
                "createdAt": "1970-01-01T00:00:00.123Z",
                "description": "foo2",
                "detailsBundleS3Key": "http://example.org",
                "id": 2,
                "isLocked": false,
                "isSolved": true,
                "project": Object {
                  "id": 1,
                  "title": "foo",
                },
                "stats": Object {
                  "solved": 1,
                  "submissions": 0,
                },
                "testCase": "a",
                "title": "foo2",
              },
              Object {
                "assets": null,
                "createdAt": "1970-01-01T00:00:00.123Z",
                "description": "foo3",
                "detailsBundleS3Key": "http://example.org",
                "id": 3,
                "isLocked": false,
                "isSolved": false,
                "project": Object {
                  "id": 1,
                  "title": "foo",
                },
                "stats": Object {
                  "solved": 0,
                  "submissions": 0,
                },
                "testCase": "a",
                "title": "foo3",
              },
            ],
            "project": Object {
              "createdAt": "1970-01-01T00:00:00.123Z",
              "description": "foo",
              "domain": "frontend",
              "id": 1,
              "solvedPercent": 66.66666666666666,
              "stats": Object {
                "solved_1": 1,
                "solved_2": 1,
              },
              "title": "foo",
            },
          }
        `);
});
