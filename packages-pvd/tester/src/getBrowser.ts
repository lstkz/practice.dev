import { launch } from './puppeteer';

export async function getBrowser() {
  return await launch({
    headless: true,
  });
}
