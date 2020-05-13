import { WEBSITE_URL } from './config';
import { Engine, MockError } from './lib/Engine';
import { authData1Verified } from './test-data';

let engine: Engine = null!;

beforeEach(async () => {
  engine = new Engine(page, WEBSITE_URL);
  await engine.setup();
});

it('should submit contact us (with validation)', async () => {
  await page.goto(WEBSITE_URL + '/contact-us');
  engine.mock('contact_sendContact', (params, count) => {
    expect(params).toEqual<typeof params>({
      category: 'Feature Request',
      email: 'a@g.com',
      message: 'abc',
    });
    if (count == 1) {
      throw new MockError('err');
    }
  });
  await $('@contact-us-page').expect.toBeVisible();
  await $('@submit-btn').click();
  await $('@email-input_error').expect.toMatch('This field is required');
  await $('@message-input_error').expect.toMatch('This field is required');
  await $('@category_error').expect.toMatch('This field is required');
  await $('@email-input').type('a');
  await $('@email-input_error').expect.toMatch('Must a valid email');
  await $('@email-input').type('@g.com');

  await $('@category .react-select__control').click();
  await $('.react-select__option').clickByText('Feature Request');
  await $('@message-input').type('abc');
  await $('@submit-btn').click();
  await $('@app-error').expect.toMatch('err');
  await $('@submit-btn').click();
  await $('@send-success').expect.toMatch('Sent successfully!');
});

it('should submit contact us', async () => {
  await page.goto(WEBSITE_URL + '/contact-us');
  engine.mock('contact_sendContact', params => {
    expect(params).toEqual<typeof params>({
      category: 'Feature Request',
      email: 'a@g.com',
      message: 'abc',
    });
  });
  await $('@contact-us-page').expect.toBeVisible();
  await $('@email-input').type('a@g.com');
  await $('@category .react-select__control').click();
  await $('.react-select__option').clickByText('Feature Request');
  await $('@message-input').type('abc');
  await $('@submit-btn').click();
  await $('@send-success').expect.toMatch('Sent successfully!');
});

it('should submit contact us as logged in', async () => {
  engine.mock('user_getMe', () => {
    return authData1Verified.user;
  });
  engine.setToken('t1');
  await page.goto(WEBSITE_URL + '/contact-us');
  engine.mock('contact_sendContact', params => {
    expect(params).toEqual<typeof params>({
      category: 'Feature Request',
      email: '1@g.com',
      message: 'abc',
    });
  });
  await $('@contact-us-page').expect.toBeVisible();
  await $('@email-input').expect.toMatch('1@g.com');
  await $('@category .react-select__control').click();
  await $('.react-select__option').clickByText('Feature Request');
  await $('@message-input').type('abc');
  await $('@submit-btn').click();
  await $('@send-success').expect.toMatch('Sent successfully!');
});
