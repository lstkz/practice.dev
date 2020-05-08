import { Engine, MockError } from './lib/Engine';
import { WEBSITE_URL } from './config';
import { authData1Verified } from './test-data';

let engine: Engine = null!;

beforeEach(async () => {
  engine = new Engine(page, WEBSITE_URL);
  await engine.setup();

  engine.mock('user_getMe', () => {
    return authData1Verified.user;
  });
  engine.mock('user_getPublicProfile', () => {
    return {
      avatarUrl: '',
      bio: 'My bio',
      country: 'PL',
      followersCount: 0,
      followingCount: 0,
      id: 'u1',
      isFollowed: false,
      likesCount: 10,
      name: 'John Doe',
      solutionsCount: 5,
      submissionsCount: 20,
      url: 'https://my-link',
      username: 'user1',
    };
  });
});

it('should open a public profile', async () => {
  await page.goto(WEBSITE_URL + '/profile/user1');
  await $('@profile-info @name').expect.toMatch('John Doe');
  await $('@profile-info @country').expect.toMatch('🇵🇱 Poland');
  await $('@profile-info @bio').expect.toMatch('“My bio“');
  await $('@profile-info @url').expect.toMatch('https://my-link');
  await $('@profile-info @url').expect.toMatchAttr('href', 'https://my-link');
  await $('@solutions-tab').expect.toMatch('Solutions (5)');
  await $('@likes-tab').expect.toMatch('Likes (10)');
});

fit('should handle not found user', async () => {
  engine.mock('user_getPublicProfile', () => {
    throw new MockError('User not found');
  });
  await page.goto(WEBSITE_URL + '/profile/user123');
  await $('@user-not-found').expect.toMatch("User doesn't exist");
});
