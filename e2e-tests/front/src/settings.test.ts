import Path from 'path';
import fs from 'fs';
import { Engine, MockError } from './lib/Engine';
import { WEBSITE_URL } from './config';
import { authData1Verified } from './test-data';

let engine: Engine = null!;

function _mockFile(name: string) {
  engine.rawMock('GET', `/avatars/${name}.png`, res => {
    res.respond({
      body: fs.readFileSync(Path.join(__dirname, './assets/cat.jpg')),
      contentType: 'image/jpg',
    });
  });
}

beforeEach(async () => {
  engine = new Engine(page, WEBSITE_URL);
  await engine.setup();

  engine.mock('user_getMe', () => {
    return authData1Verified.user;
  });
  engine.setToken('t1');
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

it('update a picture and remove it', async () => {
  engine.mock('user_getAvatarUploadUrl', (params, count) => {
    if (count === 1) {
      throw new MockError('Foo error');
    }
    return {
      fields: {},
      url: '/upload-url',
    };
  });
  engine.mock('user_completeAvatarUpload', () => {
    return {
      avatarUrl: 'abc',
    };
  });
  engine.mock('user_deleteAvatar', () => {});
  engine.rawMock('POST', '/upload-url', req => {
    req.respond({
      status: 200,
    });
  });
  _mockFile('abc-40x40');
  _mockFile('abc-140x140');
  await page.goto(WEBSITE_URL + '/settings');
  await $('@header-avatar').expect.toBeVisible();
  await $('@header-avatar img').expect.toBeHidden();
  await $('@avatar').expect.toBeVisible();
  await $('@avatar img').expect.toBeHidden();
  await $('@update-photo-btn').uploadFile(
    Path.join(__dirname, './assets/cat.jpg')
  );
  await $('@crop-modal').expect.toBeVisible();
  await $('@update-crop-btn').click();
  await $('@upload-error').expect.toMatch('An error occurred');
  await $('@update-crop-btn').click();
  await $('@crop-modal').expect.toBeHidden();
  await $('@header-avatar img').expect.toBeVisible();
  await $('@avatar img').expect.toBeVisible();
  await $('@delete-photo-btn').click();
  await $('@confirm-modal').expect.toBeVisible();
  await $('@confirm-modal @delete-btn').click();
  await $('@avatar img').expect.toBeHidden();
  await $('@header-avatar img').expect.toBeHidden();
});

it('update public profile from empty fields', async () => {
  engine.mock('user_getPublicProfile', () => {
    return {
      avatarUrl: '',
      bio: null,
      country: null,
      followersCount: 0,
      followingCount: 0,
      id: 'u1',
      isFollowed: false,
      likesCount: 10,
      name: null,
      solutionsCount: 5,
      submissionsCount: 20,
      url: null,
      username: 'user1',
    };
  });
  engine.mock('user_updatePublicProfile', (params, count) => {
    if (count === 1) {
      throw new MockError('Err');
    }
    expect(params).toEqual<typeof params>({
      name: 'n',
      bio: 'b',
      country: 'AL',
      url: 'http://a.bb',
    });
  });
  await page.goto(WEBSITE_URL + '/settings');
  await $('@name-input').expect.toMatch('', true);
  await $('@bio-input').expect.toMatch('', true);
  await $('@url-input').expect.toMatch('', true);
  await $('@country .react-select__placeholder').expect.toMatch(
    'Select...',
    true
  );
  await $('@name-input').type('n');
  await $('@country .react-select__control').click();
  await $('.react-select__option').clickByText('Albania');
  await $('@bio-input').type('b');
  await $('@url-input').type('http://a.bb');
  await $('@profile-submit').click();
  await $('@app-error').expect.toMatch('Err');
  await $('@profile-submit').click();
  await $('@update-success').expect.toMatch('Updated Successfully');
});

it('update only name from empty fields', async () => {
  engine.mock('user_getPublicProfile', () => {
    return {
      avatarUrl: '',
      bio: null,
      country: null,
      followersCount: 0,
      followingCount: 0,
      id: 'u1',
      isFollowed: false,
      likesCount: 10,
      name: null,
      solutionsCount: 5,
      submissionsCount: 20,
      url: null,
      username: 'user1',
    };
  });
  engine.mock('user_updatePublicProfile', (params, count) => {
    expect(params).toEqual<typeof params>({
      name: 'n',
      bio: null,
      country: null,
      url: null,
    });
  });
  await page.goto(WEBSITE_URL + '/settings');
  await $('@name-input').type('n');
  await $('@profile-submit').click();
  await $('@update-success').expect.toMatch('Updated Successfully');
});

it('update existing fields', async () => {
  engine.mock('user_getPublicProfile', () => {
    return {
      avatarUrl: '',
      bio: 'b',
      country: 'AL',
      followersCount: 0,
      followingCount: 0,
      id: 'u1',
      isFollowed: false,
      likesCount: 10,
      name: 'n',
      solutionsCount: 5,
      submissionsCount: 20,
      url: 'http://a.bb',
      username: 'user1',
    };
  });
  engine.mock('user_updatePublicProfile', (params, count) => {
    expect(params).toEqual<typeof params>({
      name: 'nx',
      bio: 'b',
      country: 'AL',
      url: 'http://a.bb',
    });
  });
  await page.goto(WEBSITE_URL + '/settings');

  await $('@name-input').expect.toMatch('n', true);
  await $('@bio-input').expect.toMatch('b', true);
  await $('@url-input').expect.toMatch('http://a.bb', true);
  await $('@country .react-select__single-value').expect.toMatch('Albania');
  await $('@name-input').type('x');
  await $('@profile-submit').click();
  await $('@update-success').expect.toMatch('Updated Successfully');
});
