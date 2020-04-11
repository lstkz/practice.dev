import { Page } from 'puppeteer';
import { $ as _$ } from './setup/setup-globals';

declare global {
  const page: Page;
  const $: typeof _$;
}
