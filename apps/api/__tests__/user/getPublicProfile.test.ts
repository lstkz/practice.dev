import { resetDb } from '../helper';
// import { getPublicProfile } from '../../src/contracts/user/getPublicProfile';
// import { _createSolution } from '../../src/contracts/solution/_createSolution';
// import { SubmissionStatus } from 'shared';
// import { voteSolution } from '../../src/contracts/solution/voteSolution';

beforeEach(async () => {
  await resetDb();
});

xit('return user without stats', async () => {
  const user = await getPublicProfile(undefined, 'user1');
  expect(user).toMatchInlineSnapshot(`
    Object {
      "avatarUrl": null,
      "bio": "",
      "followersCount": 0,
      "followingCount": 0,
      "id": "1",
      "isFollowed": false,
      "likesCount": 0,
      "name": "",
      "solutionsCount": 0,
      "submissionsCount": 0,
      "url": "",
      "username": "user1",
    }
  `);
});

xit('return user with stats', async () => {
  const entities = [
    new SubmissionEntity({
      submissionId: 's1',
      userId: '1',
      createdAt: 1,
      challengeId: 1,
      testUrl: 'https://example.org',
      status: SubmissionStatus.Queued,
    }),
    new SubmissionEntity({
      submissionId: 's2',
      userId: '1',
      createdAt: 1,
      challengeId: 1,
      testUrl: 'https://example.org',
      status: SubmissionStatus.Queued,
    }),
    // solution by user 2
    new SubmissionEntity({
      submissionId: 's3',
      userId: '2',
      createdAt: 1,
      challengeId: 1,
      testUrl: 'https://example.org',
      status: SubmissionStatus.Queued,
    }),
  ];
  await Promise.all<any>([
    ...entities.map(item => item.insert()),
    _createSolution({
      challengeId: 1,
      createdAt: 1,
      id: 's1',
      likes: 0,
      slug: 's1',
      tags: ['a'],
      title: 's',
      url: 's',
      userId: '1',
    }),
    _createSolution({
      challengeId: 1,
      createdAt: 1,
      id: 's2',
      likes: 0,
      slug: 's2',
      tags: ['a'],
      title: 's',
      url: 's',
      userId: '1',
    }),
  ]);
  await Promise.all([
    voteSolution('1', { like: true, solutionId: 's1' }),
    voteSolution('1', { like: true, solutionId: 's2' }),
  ]);
  await mockStream.process();
  const user = await getPublicProfile(undefined, 'user1');
  expect(user).toMatchInlineSnapshot(`
    Object {
      "avatarUrl": null,
      "bio": "",
      "followersCount": 0,
      "followingCount": 0,
      "id": "1",
      "isFollowed": false,
      "likesCount": 2,
      "name": "",
      "solutionsCount": 2,
      "submissionsCount": 2,
      "url": "",
      "username": "user1",
    }
  `);
});
