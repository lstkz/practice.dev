import { registerSampleUsers } from '../seed-data';
import { resetDb } from '../helper';
import { makeAdmin } from '../../src/contracts/user/makeAdmin';
import { handler } from '../../src/handler';
import { getUserByToken } from '../../src/contracts/user/getUserByToken';
import { updateProject } from '../../src/contracts/project/updateProject';
import { ProjectEntity, ProjectChallengeEntity } from '../../src/entities';

beforeEach(async () => {
  await resetDb();
  await registerSampleUsers();
  const user = await getUserByToken('user1_token');
  await makeAdmin(user!.id);
});

function _getChallenge(id: number) {
  return {
    id: id,
    detailsBundleS3Key: 'a' + id,
    description: 'b' + id,
    testCase: 'c' + id,
    testsBundleS3Key: 'd' + id,
    title: 'e' + id,
  };
}

it('create and update a project', async () => {
  Date.now = () => 123;
  const getLatest = () =>
    ProjectEntity.getByKey({
      projectId: 1,
    });

  await updateProject(
    {
      id: 1,
      title: 'foo',
      description: 'desc',
      domain: 'frontend',
    },
    []
  );

  expect(await getLatest()).toMatchInlineSnapshot(`
    ProjectEntity {
      "challengeCount": 0,
      "createdAt": 123,
      "description": "desc",
      "domain": "frontend",
      "entityType": "Project",
      "projectId": 1,
      "stats": Object {},
      "title": "foo",
    }
  `);

  await updateProject(
    {
      id: 1,
      title: 'foo2',
      description: 'desc2',
      domain: 'fullstack',
    },
    []
  );
  expect(await getLatest()).toMatchInlineSnapshot(`
    ProjectEntity {
      "challengeCount": 0,
      "createdAt": 123,
      "description": "desc2",
      "domain": "fullstack",
      "entityType": "Project",
      "projectId": 1,
      "stats": Object {},
      "title": "foo2",
    }
  `);
});

it('create and update a project challenges', async () => {
  Date.now = () => 123;
  const getLatest = () => ProjectChallengeEntity.getByProject(1);
  const project = {
    id: 1,
    title: 'foo',
    description: 'desc',
    domain: 'frontend',
  } as const;

  await updateProject(project, [_getChallenge(1), _getChallenge(2)]);
  expect(await getLatest()).toMatchInlineSnapshot(`
    Array [
      ProjectChallengeEntity {
        "assets": null,
        "challengeId": 1,
        "createdAt": 123,
        "description": "b1",
        "detailsBundleS3Key": "a1",
        "entityType": "ProjectChallenge",
        "projectId": 1,
        "testCase": "c1",
        "testsBundleS3Key": "d1",
        "title": "e1",
      },
      ProjectChallengeEntity {
        "assets": null,
        "challengeId": 2,
        "createdAt": 123,
        "description": "b2",
        "detailsBundleS3Key": "a2",
        "entityType": "ProjectChallenge",
        "projectId": 1,
        "testCase": "c2",
        "testsBundleS3Key": "d2",
        "title": "e2",
      },
    ]
  `);

  await updateProject(project, [
    {
      id: 1,
      detailsBundleS3Key: 'a1 - updated',
      description: 'b1- updated',
      testCase: 'c1- updated',
      testsBundleS3Key: 'd1- updated',
      title: 'e1- updated',
      assets: {
        a: 1,
      },
    },
    _getChallenge(2),
  ]);
  expect(await getLatest()).toMatchInlineSnapshot(`
    Array [
      ProjectChallengeEntity {
        "assets": Object {
          "a": 1,
        },
        "challengeId": 1,
        "createdAt": 123,
        "description": "b1- updated",
        "detailsBundleS3Key": "a1 - updated",
        "entityType": "ProjectChallenge",
        "projectId": 1,
        "testCase": "c1- updated",
        "testsBundleS3Key": "d1- updated",
        "title": "e1- updated",
      },
      ProjectChallengeEntity {
        "assets": null,
        "challengeId": 2,
        "createdAt": 123,
        "description": "b2",
        "detailsBundleS3Key": "a2",
        "entityType": "ProjectChallenge",
        "projectId": 1,
        "testCase": "c2",
        "testsBundleS3Key": "d2",
        "title": "e2",
      },
    ]
  `);

  await updateProject(project, [_getChallenge(2), _getChallenge(3)]);
  expect(await getLatest()).toMatchInlineSnapshot(`
    Array [
      ProjectChallengeEntity {
        "assets": null,
        "challengeId": 2,
        "createdAt": 123,
        "description": "b2",
        "detailsBundleS3Key": "a2",
        "entityType": "ProjectChallenge",
        "projectId": 1,
        "testCase": "c2",
        "testsBundleS3Key": "d2",
        "title": "e2",
      },
      ProjectChallengeEntity {
        "assets": null,
        "challengeId": 3,
        "createdAt": 123,
        "description": "b3",
        "detailsBundleS3Key": "a3",
        "entityType": "ProjectChallenge",
        "projectId": 1,
        "testCase": "c3",
        "testsBundleS3Key": "d3",
        "title": "e3",
      },
    ]
  `);
});

it('should set challengeCount', async () => {
  Date.now = () => 123;
  const getLatest = () =>
    ProjectEntity.getByKey({
      projectId: 1,
    }).then(x => x.challengeCount);
  const project = {
    id: 1,
    title: 'foo',
    description: 'desc',
    domain: 'frontend',
  } as const;

  await updateProject(project, [_getChallenge(1), _getChallenge(2)]);
  expect(await getLatest()).toEqual(2);
  await updateProject(project, [
    _getChallenge(1),
    _getChallenge(2),
    _getChallenge(3),
  ]);
  expect(await getLatest()).toEqual(3);
  await updateProject(project, []);
  expect(await getLatest()).toEqual(0);
});

it('should throw error if not admin', async () => {
  await expect(
    handler('project.updateProject', [], 'user2_token')
  ).rejects.toThrow('Admin only');
});
