import { WEBSITE_URL } from './config';
import { Engine } from './lib/Engine';

let engine: Engine = null!;

beforeEach(async () => {
  engine = new Engine(page, WEBSITE_URL);
  await engine.setup();
});

it('should open terms and conditions', async () => {
  await page.goto(WEBSITE_URL + '/terms');
  await $('@tos-page').expect.toBeVisible();
});

it('should privacy', async () => {
  await page.goto(WEBSITE_URL + '/privacy');
  await $('@privacy-page').expect.toBeVisible();
});
