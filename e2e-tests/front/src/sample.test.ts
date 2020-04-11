const PAGE_URL =
  'http://pd-lambda-testing-testbuild1e554354-pqxwffa65w2u.s3-website.eu-central-1.amazonaws.com/';

it('example test', async () => {
  await page.goto(PAGE_URL);
  await $('.Button_Button-sc-l0ss04.fwZKjm').expect.toBeVisible();
  await $('.Button_Button-sc-l0ss04.fwZKjm').click();
  await $('#emailOrUsername').type('dupa');
  await $('#password').type('aa');
  await $('button[type="submit"]').expect.toMatch('SIGN IN');
});
