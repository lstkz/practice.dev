import { WEBSITE_URL } from './config';
import { Engine, MockError, NoConnectionError } from './lib/Engine';
import {
  authData1,
  emptyChallenges,
  authData1Verified,
  authData2Verified,
} from './test-data';

let engine: Engine = null!;

beforeEach(async () => {
  engine = new Engine(page, WEBSITE_URL);
  await engine.setup();
});

it('should open challenges if logged in', async () => {
  engine.mock('user_getMe', () => {
    return authData1.user;
  });
  engine.mock('challenge_searchChallenges', () => emptyChallenges);
  engine.setToken('t1');
  await page.goto(WEBSITE_URL);
  await $('@challenges-page').expect.toBeVisible();
  expect(page.url()).toEqual(WEBSITE_URL + '/challenges');
  await $('@current-username').expect.toMatch('user1');
});

it('should show verify warning if not verified', async () => {
  engine.mock('user_getMe', () => {
    return authData1.user;
  });
  engine.mock('challenge_searchChallenges', () => emptyChallenges);
  engine.setToken('t1');
  await page.goto(WEBSITE_URL);
  await $('@page-warning').expect.toMatch(
    'Please check your email and confirm your account.'
  );
});

it('should not show verify warning if verified', async () => {
  engine.mock('user_getMe', () => {
    return authData1Verified.user;
  });
  engine.mock('challenge_searchChallenges', () => emptyChallenges);
  engine.setToken('t1');
  await page.goto(WEBSITE_URL);
  await $('@challenges-page').expect.toBeVisible();
  await $('@page-warning').expect.toBeHidden();
});

it('should open landing page if session is invalid', async () => {
  engine.mock('user_getMe', () => {
    throw new MockError('Invalid token');
  });
  await page.goto(WEBSITE_URL);
  await $('@landing-banner').expect.toBeVisible();
});

it('should logout and relogin', async () => {
  engine.mock('user_login', (values, count) => {
    expect(values).toEqual<typeof values>({
      password: '12345',
      emailOrUsername: 'user1',
    });
    return authData1;
  });
  engine.mock('user_getMe', () => {
    return authData1Verified.user;
  });
  engine.mock('user_login', (values, count) => {
    return authData2Verified;
  });
  engine.mock('challenge_searchChallenges', () => emptyChallenges);
  engine.setToken('t1');
  await page.goto(WEBSITE_URL);
  await $('@header-menu').click();
  await $('@logout-btn').click();
  await $('@login-input').type('u2');
  await $('@password-input').type('pass');
  await $('@login-submit').click();
  await $('@current-username').expect.toMatch('user2');
});

it('should retry getMe if not connection to API', async () => {
  engine.mock('user_getMe', (params, count) => {
    if (count === 1) {
      throw new NoConnectionError();
    }
    if (count === 2) {
      throw new MockError('error', 500);
    }
    return authData1Verified.user;
  });
  engine.setToken('t1');
  await page.goto(WEBSITE_URL);
  engine.mock('challenge_searchChallenges', () => emptyChallenges);
  await $('@current-username').expect.toMatch('user1');
});
