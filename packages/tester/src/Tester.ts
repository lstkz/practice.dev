import { Page } from 'puppeteer';
import { checkHasSelectorMatches, getSelectorMatchResult } from './dom-helper';

function convertSelector(selector: string) {
  return selector.replace(/\@([a-zA-Z0-9_-]+)/g, '[data-test="$1"]');
}

const defaultTimeout = 2500;
const defaultWaitOptions = { visible: true, timeout: defaultTimeout };

type StepResult = 'pass' | 'fail' | 'pending';

interface Step {
  id: number;
  name: string;
  result: StepResult;
  error?: string;
  exec: () => Promise<void>;
}

type TestResult = 'pass' | 'fail' | 'pending';

interface Test {
  id: number;
  name: string;
  result: TestResult;
  steps: Step[];
}

export class Tester {
  tests: Test[] = [];
  currentTest: Test | null = null;
  page: Page = null!;

  test(name: string, fn: () => void) {
    const test: Test = {
      id: this.tests.length + 1,
      name,
      result: 'pending',
      steps: [],
    };
    this.currentTest = test;
    this.tests.push(test);
    fn();
    this.currentTest = null;
  }

  rethrowNonTimeout(error: Error) {
    if (error.constructor.name === 'TimeoutError') {
      return;
    }
    throw error;
  }
  private getCurrentTest() {
    if (!this.currentTest) {
      throw new Error('Steps can be executed only within test().');
    }
    return this.currentTest;
  }

  private addStep(step: Pick<Step, 'name' | 'exec'>) {
    const test = this.getCurrentTest();
    test.steps.push({
      id: test.steps.length + 1,
      name: step.name,
      result: 'pending',
      exec: step.exec,
    });
  }

  navigate(url: string) {
    this.addStep({
      name: `Navigate to "${url}"`,
      exec: async () => {
        await this.page.goto(url, { timeout: 3000 });
      },
    });
  }

  expectToBeVisible(selector: string) {
    const input = convertSelector(selector);

    this.addStep({
      name: `Expect "${input}" to be visible`,
      exec: async () => {
        await this.page.waitForSelector(input, defaultWaitOptions);
      },
    });
  }

  expectToMatch(selector: string, expected: string | RegExp, exact = false) {
    const input = convertSelector(selector);

    this.addStep({
      name: `Expect "${input}" to equal "${expected}"`,
      exec: async () => {
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
              `Found ${
                actual.count
              } elements with selector '${selector}'. Expected only 1.`
            );
          } else {
            throw new Error(
              exact
                ? `Expect "${input}" to equal "${expected}". Actual: "${actual}".`
                : `Expect "${input}" to include "${expected}". Actual: "${actual}".`
            );
          }
        }
      },
    });
  }

  click(selector: string) {
    const input = convertSelector(selector);

    this.addStep({
      name: `Click on "${input}"`,
      exec: async () => {
        await this.page.waitForSelector(input, defaultWaitOptions);
        await this.page.click(input);
      },
    });
  }
}
