import { Page, WaitForSelectorOptions } from 'puppeteer';
import {
  checkHasSelectorMatches,
  getSelectorMatchResult,
  isPuppeteerTimeout,
} from './helper';
import { TestError } from './TestError';
import { StepNotifier } from './types';

function rethrowNonTimeout(error: Error) {
  if (!isPuppeteerTimeout(error)) {
    throw error;
  }
}

function convertSelector(selector: string) {
  return selector.replace(/\@([a-zA-Z0-9_-]+)/g, '[data-test="$1"]');
}

export class TesterPage {
  private waitOptions: WaitForSelectorOptions;

  constructor(
    private stepNotifier: StepNotifier,
    private page: Page,
    private defaultTimeout: number
  ) {
    this.waitOptions = {
      visible: true,
      timeout: defaultTimeout,
    };
  }

  async navigate(url: string) {
    await this.stepNotifier.notify(`Navigate to "${url}"`);
    await this.page.goto(url, { timeout: 5000, waitUntil: 'domcontentloaded' });
  }

  async expectToBeVisible(selector: string) {
    const input = convertSelector(selector);
    await this.stepNotifier.notify(`Expect "${input}" to be visible`);
    await this.page.waitForSelector(input, this.waitOptions);
  }

  async expectToMatch(selector: string, expected: string, exact = false) {
    const input = convertSelector(selector);
    await this.stepNotifier.notify(
      `Expect "${input}" to ${exact ? 'equal' : 'contain'} "${expected}"`
    );
    await this.page.waitForSelector(input, this.waitOptions);

    const handle = await this.page.evaluateHandle(() => document);
    try {
      await this.page.waitForFunction(
        checkHasSelectorMatches,
        {
          timeout: this.defaultTimeout,
        },
        handle,
        input,
        expected as any,
        exact
      );
    } catch (error) {
      rethrowNonTimeout(error);
      const actual = await this.page.evaluate(
        getSelectorMatchResult,
        handle,
        input
      );
      if (typeof actual === 'object' && actual.error === 'multiple') {
        throw new TestError(
          `Found ${actual.count} elements with selector "${input}". Expected only 1.`
        );
      } else {
        throw new TestError(
          exact
            ? `Expected "${input}" to equal "${expected}". Actual: "${actual}".`
            : `Expected "${input}" to include "${expected}". Actual: "${actual}".`
        );
      }
    }
  }

  async click(selector: string) {
    const input = convertSelector(selector);
    await this.stepNotifier.notify(`Click on "${input}"`);
    await this.page.waitForSelector(input, this.waitOptions);
    await this.page.click(input);
  }

  async type(selector: string, text: string) {
    const input = convertSelector(selector);
    await this.stepNotifier.notify(`Type "${text}" to "${input}"`);
    await this.page.waitForSelector(input, this.waitOptions);
    await this.page.type(input, text, { delay: 10 });
  }

  async expectToBeEnabled(selector: string) {
    const input = convertSelector(selector);
    await this.stepNotifier.notify(`Expect "${input}" to be enabled`);
    await this.page.waitForSelector(input, this.waitOptions);
    const handle = await this.page.evaluateHandle(() => document);
    try {
      await this.page.waitForFunction(
        (handle, input) => {
          const elements = [...handle.querySelectorAll(input)];
          if (elements.length !== 1) {
            return null;
          }
          const element = elements[0];
          return element.getAttribute('disabled') === null;
        },
        {
          timeout: this.defaultTimeout,
        },
        handle,
        input
      );
    } catch (error) {
      rethrowNonTimeout(error);
      const actual = await this.page.evaluate(
        (handle, input) => {
          const elements = [...handle.querySelectorAll(input)];
          if (elements.length !== 1) {
            return { error: 'multiple', count: elements.length };
          }
          return null;
        },
        handle,
        input
      );
      if (actual?.error === 'multiple') {
        throw new TestError(
          `Found ${actual.count} elements with selector '${selector}'. Expected only 1.`
        );
      }
      throw new TestError(
        `Expected "${input}" to be enabled, but it's still disabled`
      );
    }
  }

  async close() {
    await this.page.close();
  }

  async reload() {
    await this.stepNotifier.notify(`Reloading page`);
    await this.page.reload();
  }

  async clear(selector: string) {
    const input = convertSelector(selector);
    await this.stepNotifier.notify(`Clear "${input}"`);
    await this.page.waitForSelector(input, this.waitOptions);
    await this.page.click(input, { clickCount: 3 });
    await this.page.keyboard.press('Backspace');
  }
}
