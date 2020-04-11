import { WEBSITE_URL } from './config';

it('verify landing page', async () => {
  await page.goto(WEBSITE_URL);
  await $('@landing-banner').expect.toBeVisible();
  await $('@top-login-btn').expect.toMatchAttr('href', '/login');
  await $('@top-register-btn').expect.toMatchAttr('href', '/register');
  await $('@banner-register-btn').expect.toMatchAttr('href', '/register');
  await $('@start-coding-register-btn').expect.toMatchAttr('href', '/register');
});
