import { TestConfiguration, Notifier } from './types';
import { Tester } from './Tester';
import { getBrowser } from './getBrowser';
import { TestInfo } from 'shared';
import { Browser } from 'puppeteer';
import { TestError } from './TestError';
import { TimeoutError } from 'puppeteer/Errors';

const createdBrowsers: Browser[] = [];

async function getPage() {
  const browser = await getBrowser();
  createdBrowsers.push(browser);
  const page = await browser.newPage();
  return page;
}

export async function runTests(
  id: string,
  url: string,
  config: TestConfiguration,
  notifier: Notifier
) {
  const meta = { id: id };
  let currentTestId = 0;

  const tester = new Tester(
    {
      notify(text, data) {
        return notifier.notify({
          type: 'STEP',
          meta,
          payload: { text, data, testId: currentTestId },
        });
      },
    },
    getPage
  );

  await config.handler({
    tester,
    url,
  });

  let success = true;

  const serialized: TestInfo[] = tester.tests.map(test => ({
    id: test.id,
    name: test.name,
    result: 'pending',
    steps: [],
  }));
  serialized[0].result = 'running';

  await notifier.notify({
    type: 'TEST_INFO',
    meta,
    payload: { tests: serialized },
  });
  await notifier.flush();

  for (const test of tester.tests) {
    currentTestId = test.id;
    await notifier.notify({
      type: 'STARTING_TEST',
      meta,
      payload: { testId: test.id },
    });

    try {
      await test.exec();
      await notifier.notify({
        type: 'TEST_PASS',
        meta,
        payload: { testId: test.id },
      });
    } catch (e) {
      success = false;
      if (e instanceof TestError || e instanceof TimeoutError) {
        await notifier.notify({
          type: 'TEST_FAIL',
          meta,
          payload: { testId: test.id, error: e.message },
        });
      } else {
        console.error(`Internal error when testing ${id}`, e);
        await notifier.notify({
          type: 'TEST_FAIL',
          meta,
          payload: { testId: test.id, error: 'Internal Error' },
        });
      }
      break;
    }
  }
  await notifier.notify({ type: 'RESULT', meta, payload: { success } });
  await notifier.flush();

  for (const browser of createdBrowsers) {
    try {
      browser.close();
    } catch (e) {
      console.error(e);
    }
  }
}
