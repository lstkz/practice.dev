import { WEBSITE_URL } from './config';

it('example test', async () => {
  await page.goto(WEBSITE_URL);
  await $('.Button_Button-sc-l0ss04.fwZKjm').expect.toBeVisible();
  await $('.Button_Button-sc-l0ss04.fwZKjm').click();
  await $('#password').type('aa');
  await $('button[type="submit"]').expect.toMatch('SIGN IN');
});
