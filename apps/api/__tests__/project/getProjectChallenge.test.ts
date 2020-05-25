import { resetDb } from '../helper';
import { registerSampleUsers, addSampleProjects } from '../seed-data';
import { createProjectChallengeSolvedCUD } from '../../src/cud/projectChallengeSolved';
import { getProjectChallenge } from '../../src/contracts/project/getProjectChallenge';

const userId = '1';

beforeEach(async () => {
  Date.now = () => 123;
  await resetDb();
  await Promise.all([registerSampleUsers(), addSampleProjects()]);
});

it('throw error if project not found', async () => {
  await expect(
    getProjectChallenge(userId, {
      projectId: 1234,
      challengeId: 1,
    })
  ).rejects.toThrow('Project not found');
});

it('throw error if challenge not found', async () => {
  await expect(
    getProjectChallenge(userId, {
      projectId: 1,
      challengeId: 1234,
    })
  ).rejects.toThrow('Challenge not found');
});

it('throw error if no permission', async () => {
  await expect(
    getProjectChallenge(userId, {
      projectId: 1,
      challengeId: 2,
    })
  ).rejects.toThrow(
    'You must solve previous challenges to access this challenge'
  );
});

it('throw error if no permission (anonymous)', async () => {
  await expect(
    getProjectChallenge(undefined, {
      projectId: 1,
      challengeId: 2,
    })
  ).rejects.toThrow(
    'You must solve previous challenges to access this challenge'
  );
});

it('should return a challenge (first)', async () => {
  expect(
    await getProjectChallenge(undefined, {
      projectId: 1,
      challengeId: 1,
    })
  ).toMatchInlineSnapshot(`
    Object {
      "assets": null,
      "createdAt": "1970-01-01T00:00:00.123Z",
      "description": "foo1",
      "detailsBundleS3Key": "http://example.org",
      "domain": "frontend",
      "id": 1,
      "isLocked": false,
      "isSolved": false,
      "project": Object {
        "challengeCount": 3,
        "id": 1,
        "title": "foo",
      },
      "stats": Object {
        "solved": 0,
        "submissions": 0,
      },
      "testCase": "a",
      "title": "foo1",
    }
  `);
});

it('should return a challenge (second)', async () => {
  await createProjectChallengeSolvedCUD({
    challengeId: 1,
    projectId: 1,
    solvedAt: 1,
    userId,
  });

  expect(
    await getProjectChallenge(userId, {
      projectId: 1,
      challengeId: 2,
    })
  ).toMatchInlineSnapshot(`
    Object {
      "assets": null,
      "createdAt": "1970-01-01T00:00:00.123Z",
      "description": "foo2",
      "detailsBundleS3Key": "http://example.org",
      "domain": "fullstack",
      "id": 2,
      "isLocked": false,
      "isSolved": false,
      "project": Object {
        "challengeCount": 3,
        "id": 1,
        "title": "foo",
      },
      "stats": Object {
        "solved": 0,
        "submissions": 0,
      },
      "testCase": "a",
      "title": "foo2",
    }
  `);
});
