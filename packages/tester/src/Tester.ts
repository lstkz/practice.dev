import { Page } from 'puppeteer';
import { checkHasSelectorMatches, getSelectorMatchResult } from './dom-helper';

function convertSelector(selector: string) {
  return selector.replace(/\@([a-zA-Z0-9_-]+)/g, '[data-test="$1"]');
}

const defaultTimeout = 2500;
const defaultWaitOptions = { visible: true, timeout: defaultTimeout };

type TestResult = 'pass' | 'fail' | 'pending';

interface Test {
  id: number;
  name: string;
  result: TestResult;
  exec: () => Promise<void>;
}

interface StepNotifier {
  notify(text: string, data?: any): Promise<void>;
}

export class Tester {
  tests: Test[] = [];
  page: Page = null!;

  constructor(private stepNotifier: StepNotifier) {}

  test(name: string, fn: () => Promise<void>) {
    const test: Test = {
      id: this.tests.length + 1,
      name,
      result: 'pending',
      exec: fn,
    };
    this.tests.push(test);
  }

  rethrowNonTimeout(error: Error) {
    if (error.constructor.name === 'TimeoutError') {
      return;
    }
    throw error;
  }

  async navigate(url: string) {
    await this.stepNotifier.notify(`Navigate to "${url}"`);
    await this.page.goto(url, { timeout: 5000, waitUntil: 'load' });
  }

  async expectToBeVisible(selector: string) {
    const input = convertSelector(selector);
    await this.stepNotifier.notify(`Expect "${input}" to be visible`);
    await this.page.waitForSelector(input, defaultWaitOptions);
  }

  async expectToMatch(
    selector: string,
    expected: string | RegExp,
    exact = false
  ) {
    const input = convertSelector(selector);
    await this.stepNotifier.notify(`Expect "${input}" to equal "${expected}"`);

    const handle = await this.page.evaluateHandle(() => document);
    try {
      await this.page.waitForFunction(
        checkHasSelectorMatches,
        {
          timeout: defaultTimeout,
        },
        handle,
        input,
        expected as any,
        exact
      );
    } catch (error) {
      this.rethrowNonTimeout(error);
      const actual = await this.page.evaluate(
        getSelectorMatchResult,
        handle,
        input
      );
      if (typeof actual === 'object' && actual.error === 'multiple') {
        throw new Error(
          `Found ${actual.count} elements with selector '${selector}'. Expected only 1.`
        );
      } else {
        throw new Error(
          exact
            ? `Expect "${input}" to equal "${expected}". Actual: "${actual}".`
            : `Expect "${input}" to include "${expected}". Actual: "${actual}".`
        );
      }
    }
  }

  async click(selector: string) {
    const input = convertSelector(selector);
    await this.stepNotifier.notify(`Click on "${input}"`);
    await this.page.waitForSelector(input, defaultWaitOptions);
    await this.page.click(input);
  }
}
