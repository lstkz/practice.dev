import { WEBSITE_URL } from './config';
import { Engine } from './lib/Engine';

let engine: Engine = null!;

beforeEach(async () => {
  engine = new Engine(page, WEBSITE_URL);
  await engine.setup();
});

it('verify landing page', async () => {
  await page.goto(WEBSITE_URL);
  await $('@landing-banner').expect.toBeVisible();
  await $('@top-login-btn').expect.toMatchAttr('href', '/login');
  await $('@top-register-btn').expect.toMatchAttr('href', '/register');
  await $('@banner-register-btn').expect.toMatchAttr('href', '/register');
  await $('@start-coding-register-btn').expect.toMatchAttr('href', '/register');
});
