import { resetDb } from '../helper';
import { registerSampleUsers, addSampleChallenges } from '../seed-data';
import { getPublicProfile } from '../../src/contracts/user/getPublicProfile';
import { SubmissionStatus } from 'shared';
import { voteSolution } from '../../src/contracts/solution/voteSolution';
import { createSolutionCUD } from '../../src/cud/solution';
import { createSubmissionCUD } from '../../src/cud/submission';

beforeEach(async () => {
  await resetDb();
  await Promise.all([addSampleChallenges(), registerSampleUsers()]);
});

it('return user without stats', async () => {
  const user = await getPublicProfile(undefined, 'user1');
  expect(user).toMatchInlineSnapshot(`
    Object {
      "avatarUrl": null,
      "bio": "",
      "country": null,
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

it('return user with stats', async () => {
  await Promise.all<any>([
    createSubmissionCUD({
      submissionId: 's1',
      userId: '1',
      createdAt: 1,
      challengeId: 1,
      testUrl: 'https://example.org',
      status: SubmissionStatus.Queued,
      type: 'challenge',
    }),
    createSubmissionCUD({
      submissionId: 's2',
      userId: '1',
      createdAt: 1,
      challengeId: 1,
      testUrl: 'https://example.org',
      status: SubmissionStatus.Queued,
      type: 'challenge',
    }),
    // solution by user 2
    createSubmissionCUD({
      submissionId: 's3',
      userId: '2',
      createdAt: 1,
      challengeId: 1,
      testUrl: 'https://example.org',
      status: SubmissionStatus.Queued,
      type: 'challenge',
    }),
    createSolutionCUD({
      challengeId: 1,
      createdAt: 1,
      solutionId: 's1',
      likes: 0,
      slug: 's1',
      tags: ['a'],
      title: 's',
      url: 's',
      userId: '1',
    }),
    createSolutionCUD({
      challengeId: 1,
      createdAt: 1,
      solutionId: 's2',
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
  const user = await getPublicProfile(undefined, 'user1');
  expect(user).toMatchInlineSnapshot(`
    Object {
      "avatarUrl": null,
      "bio": "",
      "country": null,
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
