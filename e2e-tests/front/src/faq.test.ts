import { WEBSITE_URL } from './config';
import { Engine } from './lib/Engine';

let engine: Engine = null!;

beforeEach(async () => {
  engine = new Engine(page, WEBSITE_URL);
  await engine.setup();
});

it('should open faq and navigate', async () => {
  await page.goto(WEBSITE_URL + '/faq');

  await $('@faq-title').expect.toMatch('What is practice.dev?');
  await $('@side-menu-whats-the-license-for-solutions').click();
  await $('@faq-title').expect.toMatch(
    'What is the license for the solutions I post?'
  );
  await page.reload();
  await $('@faq-title').expect.toMatch(
    'What is the license for the solutions I post?'
  );
});
