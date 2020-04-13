import { WEBSITE_URL } from './config';
import { Engine, MockError } from './lib/Engine';
import { authData1, emptyChallenges, authData1Verified } from './test-data';

let engine: Engine = null!;

beforeEach(async () => {
  engine = new Engine(page, WEBSITE_URL);
  await engine.setup();
});

fit('should open challenges if logged in', async () => {
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
  $('@page-warning').expect.toMatch(
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
  $('@page-warning').expect.toBeHidden();
});

it('should open landing page if session is invalid', async () => {
  engine.mock('user_getMe', () => {
    throw new MockError('Invalid token');
  });
  await page.goto(WEBSITE_URL);
  await $('@landing-banner').expect.toBeVisible();
});
