import { WEBSITE_URL } from './config';
import { Engine, MockError } from './lib/Engine';

let engine: Engine = null!;

beforeEach(async () => {
  engine = new Engine(page, WEBSITE_URL);
  await engine.setup();
});

it('should subscribe for contests (with validation)', async () => {
  await page.goto(WEBSITE_URL + '/contests');
  engine.mock(
    'featureSubscription_createFeatureSubscription',
    (params, count) => {
      expect(params).toEqual<typeof params>(['contest', 'a@g.com']);
      if (count == 1) {
        throw new MockError('err');
      }
    }
  );
  await $('@contests-page').expect.toBeVisible();
  await $('@submit-btn').click();
  await $('@email-input_error').expect.toMatch('This field is required');
  await $('@email-input').type('a');
  await $('@email-input_error').expect.toMatch('Must a valid email');
  await $('@email-input').type('@g.com');
  await $('@submit-btn').click();
  await $('@app-error').expect.toMatch('err');
  await $('@submit-btn').click();
  await $('@subscribe-success').expect.toMatch('Subscribed successfully!');
});

it('should subscribe for contests', async () => {
  await page.goto(WEBSITE_URL + '/contests');
  engine.mock('featureSubscription_createFeatureSubscription', params => {
    expect(params).toEqual<typeof params>(['contest', 'a@g.com']);
  });
  await $('@contests-page').expect.toBeVisible();
  await $('@email-input').type('a@g.com');
  await $('@submit-btn').click();
  await $('@submit-btn').click();
  await $('@subscribe-success').expect.toMatch('Subscribed successfully!');
});
