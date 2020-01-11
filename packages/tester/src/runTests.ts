import { TestConfiguration, Notifier } from './types';
import { Tester } from './Tester';
import { getBrowser } from './getBrowser';

async function getPage() {
  const browser = await getBrowser();
  const page = await browser.newPage();
  return page;
}

export async function runTests(
  url: string,
  config: TestConfiguration,
  notifier: Notifier
) {
  const tester = new Tester();

  await config.handler({
    tester,
    url,
    createPage: async () => {
      if (config.page === 'single') {
        throw new Error('createPage cannot be called in single mode');
      }
      return await getPage();
    },
  });
  if (config.page === 'single') {
    tester.page = await getPage();
  }

  let success = true;

  const serialized = tester.tests.map(test => ({
    id: test.id,
    name: test.name,
    result: 'pending' as 'pending',
    steps: test.steps.map(step => ({
      id: step.id,
      name: step.name,
      result: 'pending' as 'pending',
    })),
  }));

  await notifier.notify({ type: 'TEST_INFO', payload: { tests: serialized } });
  await notifier.flush();

  for (const test of tester.tests) {
    await notifier.notify({
      type: 'STARTING_TEST',
      payload: { testId: test.id },
    });
    for (const step of test.steps) {
      try {
        await notifier.notify({
          type: 'STARTING_STEP',
          payload: { testId: test.id, stepId: step.id },
        });
        await step.exec();
        await notifier.notify({
          type: 'STEP_PASS',
          payload: { testId: test.id, stepId: step.id },
        });
      } catch (e) {
        success = false;
        await notifier.notify({
          type: 'STEP_FAIL',
          payload: { testId: test.id, stepId: step.id, error: e.message },
        });
        break;
      }
    }
    if (!success) {
      await notifier.notify({
        type: 'TEST_FAIL',
        payload: { testId: test.id },
      });
      break;
    }
    await notifier.notify({ type: 'TEST_PASS', payload: { testId: test.id } });
  }
  await notifier.notify({ type: 'RESULT', payload: { success } });
  await notifier.flush();
}
