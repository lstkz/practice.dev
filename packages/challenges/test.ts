import { runTests, ConsoleNotifier } from '@pvd/tester';

const [, , id, url] = process.argv;

async function run() {
  try {
    await runTests(
      'mock',
      url || 'http://localhost:1234',
      require(`./${id}/test-case`).default,
      new ConsoleNotifier()
    );
  } catch (e) {
    console.error(e.stack);
  } finally {
    process.exit();
  }
}

run();
