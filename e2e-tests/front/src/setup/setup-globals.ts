import fs from 'fs';
import { ElementHandle } from 'puppeteer';
import AWS from 'aws-sdk';

const s3 = new AWS.S3();

jest.setTimeout(process.env.AWS ? 10000 : 30000);

function convertSelector(selector: string) {
  return selector.replace(/\@([a-zA-Z0-9_-]+)/g, '[data-test="$1"]');
}

const defaultTimeout = 2500;
const defaultWaitOptions = { visible: true, timeout: defaultTimeout };

const enhanceError = (error: Error, message: string) => {
  error.message = `${message}\n${error.message}`;
  return error;
};

function rethrowNonTimeout(error: Error) {
  if (error.constructor.name !== 'TimeoutError') {
    throw error;
  }
}

function wrapWithScreenshot<T extends { [x: string]: any }>(obj: T) {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object') {
      wrapWithScreenshot(obj[key]);
      return;
    }
    const target = obj[key];
    (obj as any)[key] = async function (...args: any[]) {
      try {
        return await target.call(this, ...args);
      } catch (e) {
        if (process.env.AWS) {
          const BUCKET_NAME = process.env.BUCKET_NAME;
          const filename =
            'screenshot_' + Math.floor(Math.random() * 1e6) + '.png';
          const path = '/tmp/' + filename;
          await page.screenshot({
            path,
          });
          await s3
            .upload({
              ContentType: 'image/png',
              Bucket: BUCKET_NAME,
              Body: fs.readFileSync(path),
              Key: 'screenshots/' + filename,
            })
            .promise();
          const url = s3.getSignedUrl('getObject', {
            Bucket: BUCKET_NAME,
            Key: 'screenshots/' + filename,
          });
          e.stack += '\nScreenshot ' + url;
        }
        throw e;
      }
    };
  });

  return obj;
}

export function $(selector: string) {
  const input = convertSelector(selector);

  return wrapWithScreenshot({
    async click() {
      await page.waitForSelector(input, defaultWaitOptions);
      await page.click(input);
    },
    async clickByText(text: string) {
      const handle = await page.evaluateHandle(() => document);
      const btn = (await page.waitForFunction(
        (handle, input, text) => {
          const elements = [...handle.querySelectorAll(input)];
          return elements.find(element => element.innerText.includes(text));
        },
        {
          timeout: defaultTimeout,
        },
        handle,
        input,
        text
      )) as ElementHandle;
      await btn.click();
    },
    async clickClient() {
      await page.waitForSelector(input, defaultWaitOptions);
      await page.evaluate(input => {
        document.querySelector<HTMLButtonElement>(input).click();
      }, input);
    },
    async type(text: string) {
      await page.waitForSelector(input, defaultWaitOptions);
      await page.type(input, text, { delay: 10 });
    },
    async press(key: string) {
      await page.waitForSelector(input, defaultWaitOptions);
      await (await page.$(input)).press(key);
    },
    async clear() {
      await page.waitForSelector(input, defaultWaitOptions);
      await page.click(input, { clickCount: 3 });
      await page.keyboard.press('Backspace');
    },
    async blur() {
      await page.waitForSelector(input, defaultWaitOptions);
      await page.$eval(input, (e: any) => e.blur());
    },
    async uploadFile(path: string) {
      await page.waitForSelector(input, defaultWaitOptions);
      const [fileChooser] = await Promise.all([
        page.waitForFileChooser({ timeout: defaultTimeout }),
        page.click(input),
      ]);
      await fileChooser.accept([path]);
    },
    expect: {
      async toBeVisible() {
        try {
          await page.waitForSelector(input, defaultWaitOptions);
        } catch (error) {
          rethrowNonTimeout(error);
          throw enhanceError(error, `Element ${selector} not found`);
        }
      },
      async toBeHidden() {
        try {
          await page.waitForSelector(input, {
            timeout: defaultTimeout,
            hidden: true,
          });
        } catch (error) {
          rethrowNonTimeout(error);
          throw enhanceError(error, `Element ${selector} is still visible`);
        }
      },
      async toHaveLength(expected: number) {
        const handle = await page.evaluateHandle(() => document);
        try {
          await page.waitForFunction(
            (handle, input, expected) => {
              const elements = handle.querySelectorAll(input);
              return elements.length === expected;
            },
            {
              timeout: defaultTimeout,
            },
            handle,
            input,
            expected
          );
        } catch (error) {
          rethrowNonTimeout(error);
          const actual = await page.evaluate(
            (handle, input) =>
              [...handle.querySelectorAll(input)].map(x => x.toString()),
            handle,
            input
          );
          expect(actual).toHaveLength(expected);
        }
      },
      async toHaveValue(expected: string) {
        await this.toMatch(expected, true);
      },
      async toMatchAttr(name: string, expected: string) {
        const handle = await page.evaluateHandle(() => document);
        try {
          await page.waitForFunction(
            (handle, input, name, expected) => {
              const elements = [...handle.querySelectorAll(input)];
              if (elements.length !== 1) {
                return null;
              }
              const element = elements[0];
              return element.getAttribute(name) === expected;
            },
            {
              timeout: defaultTimeout,
            },
            handle,
            input,
            name,
            expected
          );
        } catch (error) {
          rethrowNonTimeout(error);
          const actual = await page.evaluate(
            (handle, input, name) => {
              const elements = [...handle.querySelectorAll(input)];
              if (elements.length !== 1) {
                return { error: 'multiple', count: elements.length };
              }
              return { attr: elements[0].getAttribute(name) };
            },
            handle,
            input,
            name
          );
          if (actual.error === 'multiple') {
            throw new Error(
              `Found ${actual.count} elements with selector '${selector}'. Expected only 1.`
            );
          }
          expect(actual.attr).toEqual(expected);
        }
      },
      async toMatch(expected: string, exact = false) {
        const handle = await page.evaluateHandle(() => document);
        try {
          await page.waitForFunction(
            (handle, input, expected, exact) => {
              const elements = [...handle.querySelectorAll(input)];
              if (elements.length !== 1) {
                return null;
              }
              const element = elements[0];
              const textContent: string =
                element.tagName.toLowerCase() === 'input'
                  ? element.value
                  : element.textContent;
              if (typeof expected === 'string') {
                return exact
                  ? textContent === expected
                  : textContent.includes(expected);
              }
              return expected.test(textContent);
            },
            {
              timeout: defaultTimeout,
            },
            handle,
            input,
            expected,
            exact
          );
        } catch (error) {
          rethrowNonTimeout(error);
          const actual = await page.evaluate(
            (handle, input) => {
              const elements = [...handle.querySelectorAll(input)];
              if (elements.length !== 1) {
                return { error: 'multiple', count: elements.length };
              }
              const element = elements[0];
              return {
                text:
                  element.tagName.toLowerCase() === 'input'
                    ? element.value
                    : element.textContent,
              };
            },
            handle,
            input
          );
          if (actual.error === 'multiple') {
            throw new Error(
              `Found ${actual.count} elements with selector '${selector}'. Expected only 1.`
            );
          }
          expect(actual.text).toMatch(expected);
        }
      },
    },
  });
}

(global as any).$ = $;
