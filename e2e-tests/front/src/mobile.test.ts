import { WEBSITE_URL } from './config';
import { Engine } from './lib/Engine';
import { emptyChallenges, authData1Verified } from './test-data';

let engine: Engine = null!;

beforeEach(async () => {
  engine = new Engine(page, WEBSITE_URL);
  await engine.setup();
  engine.mock('challenge_searchChallenges', () => emptyChallenges);
  await page.setViewport({
    width: 600,
    height: 1000,
    isMobile: true,
  });
});

it('open and hide menu', async () => {
  await page.goto(WEBSITE_URL + '/challenges');
  await $('@header-login').expect.toBeVisible();
  await $('@mobile-menu').click();
  await $('@mobile-sidebar').expect.toBeVisible();
  await $('@mobile-sidebar @close').click();
  await $('@mobile-sidebar').expect.toBeHidden();
});

it('verify links as anonymous', async () => {
  await page.goto(WEBSITE_URL + '/challenges');
  await $('@mobile-menu').click();
  await $('@mobile-sidebar @username').expect.toMatch('Hello Visitor!');
  await $('@mobile-sidebar @register').expect.toBeVisible();
  await $('@mobile-sidebar @login').expect.toBeVisible();
  await $('@mobile-sidebar @logout').expect.toBeHidden();
});

it('verify links as logged in user', async () => {
  engine.mock('user_getMe', () => {
    return authData1Verified.user;
  });
  engine.setToken('t1');
  await page.goto(WEBSITE_URL + '/challenges');
  await $('@header-avatar').expect.toBeVisible();
  await $('@mobile-menu').click();
  await $('@mobile-sidebar @username').expect.toMatch('user1');
  await $('@mobile-sidebar @register').expect.toBeHidden();
  await $('@mobile-sidebar @login').expect.toBeHidden();
  await $('@mobile-sidebar @logout').expect.toBeVisible();
});
