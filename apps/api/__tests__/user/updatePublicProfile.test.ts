import { resetDb } from '../helper';
import { registerSampleUsers, addSampleChallenges } from '../seed-data';
import { getPublicProfile } from '../../src/contracts/user/getPublicProfile';
import { updatePublicProfile } from '../../src/contracts/user/updatePublicProfile';

beforeEach(async () => {
  await resetDb();
  await Promise.all([addSampleChallenges(), registerSampleUsers()]);
});

it('update profile', async () => {
  await updatePublicProfile('1', {
    name: 'foo',
    bio: 'zz',
    country: 'PL',
    url: 'https://url.com',
  });
  let user = await getPublicProfile(undefined, 'user1');
  expect(user).toMatchInlineSnapshot(`
    Object {
      "avatarUrl": null,
      "bio": "zz",
      "country": "PL",
      "followersCount": 0,
      "followingCount": 0,
      "id": "1",
      "isFollowed": false,
      "likesCount": 0,
      "name": "foo",
      "solutionsCount": 0,
      "submissionsCount": 0,
      "url": "https://url.com",
      "username": "user1",
    }
  `);
  await updatePublicProfile('1', {
    name: 'ww',
  });
  user = await getPublicProfile(undefined, 'user1');
  expect(user).toMatchInlineSnapshot(`
    Object {
      "avatarUrl": null,
      "bio": "zz",
      "country": "PL",
      "followersCount": 0,
      "followingCount": 0,
      "id": "1",
      "isFollowed": false,
      "likesCount": 0,
      "name": "ww",
      "solutionsCount": 0,
      "submissionsCount": 0,
      "url": "https://url.com",
      "username": "user1",
    }
  `);
});
