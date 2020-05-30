process.env.DEFAULT_WAIT_TIME = '100';

import http from 'http';
import { TestConfiguration, Notifier } from '../types';
import { runTests } from '../runTests';
import { SocketMessage } from 'shared';
import { initFrontendServer } from './helper';

const port = 6899;

class TestNotifier implements Notifier {
  messages: any[] = [];
  async flush() {
    this.messages.push('flush');
  }

  async notify(action: SocketMessage) {
    this.messages.push(action);
  }
}

describe('frontend single page', () => {
  let html = '';
  let server: http.Server;
  let testConfig: TestConfiguration;

  beforeAll(async () => {
    server = await initFrontendServer(port, () => html);
  });

  afterAll(async done => {
    server.close(done);
  });

  beforeEach(() => {
    html = '';
    testConfig = {
      page: 'single',
      handler({ tester, url }) {
        tester.test('navigate to page', async () => {
          await tester.navigate(url);
        });

        tester.test('verify text', async () => {
          await tester.expectToMatch('@text', 'foo');
        });
      },
    };
  });

  it('all tests successfully', async () => {
    html = '<div data-test="text">foobar</div>';
    const notifier = new TestNotifier();
    await runTests('mock', 'http://localhost:' + port, testConfig, notifier);
    expect(notifier.messages).toMatchInlineSnapshot(`
      Array [
        Object {
          "meta": Object {
            "id": "mock",
          },
          "payload": Object {
            "tests": Array [
              Object {
                "id": 1,
                "name": "navigate to page",
                "result": "running",
                "steps": Array [],
              },
              Object {
                "id": 2,
                "name": "verify text",
                "result": "pending",
                "steps": Array [],
              },
            ],
          },
          "type": "TEST_INFO",
        },
        "flush",
        Object {
          "meta": Object {
            "id": "mock",
          },
          "payload": Object {
            "testId": 1,
          },
          "type": "STARTING_TEST",
        },
        Object {
          "meta": Object {
            "id": "mock",
          },
          "payload": Object {
            "data": undefined,
            "testId": 1,
            "text": "Navigate to \\"http://localhost:6899\\"",
          },
          "type": "STEP",
        },
        Object {
          "meta": Object {
            "id": "mock",
          },
          "payload": Object {
            "testId": 1,
          },
          "type": "TEST_PASS",
        },
        Object {
          "meta": Object {
            "id": "mock",
          },
          "payload": Object {
            "testId": 2,
          },
          "type": "STARTING_TEST",
        },
        Object {
          "meta": Object {
            "id": "mock",
          },
          "payload": Object {
            "data": undefined,
            "testId": 2,
            "text": "Expect \\"[data-test=\\"text\\"]\\" to contain \\"foo\\"",
          },
          "type": "STEP",
        },
        Object {
          "meta": Object {
            "id": "mock",
          },
          "payload": Object {
            "testId": 2,
          },
          "type": "TEST_PASS",
        },
        Object {
          "meta": Object {
            "id": "mock",
          },
          "payload": Object {
            "success": true,
          },
          "type": "RESULT",
        },
        "flush",
      ]
    `);
  });

  it('should fail', async () => {
    html = '<div data-test="text">abc</div>';
    const notifier = new TestNotifier();
    await runTests('mock', 'http://localhost:' + port, testConfig, notifier);
    expect(notifier.messages).toMatchInlineSnapshot(`
      Array [
        Object {
          "meta": Object {
            "id": "mock",
          },
          "payload": Object {
            "tests": Array [
              Object {
                "id": 1,
                "name": "navigate to page",
                "result": "running",
                "steps": Array [],
              },
              Object {
                "id": 2,
                "name": "verify text",
                "result": "pending",
                "steps": Array [],
              },
            ],
          },
          "type": "TEST_INFO",
        },
        "flush",
        Object {
          "meta": Object {
            "id": "mock",
          },
          "payload": Object {
            "testId": 1,
          },
          "type": "STARTING_TEST",
        },
        Object {
          "meta": Object {
            "id": "mock",
          },
          "payload": Object {
            "data": undefined,
            "testId": 1,
            "text": "Navigate to \\"http://localhost:6899\\"",
          },
          "type": "STEP",
        },
        Object {
          "meta": Object {
            "id": "mock",
          },
          "payload": Object {
            "testId": 1,
          },
          "type": "TEST_PASS",
        },
        Object {
          "meta": Object {
            "id": "mock",
          },
          "payload": Object {
            "testId": 2,
          },
          "type": "STARTING_TEST",
        },
        Object {
          "meta": Object {
            "id": "mock",
          },
          "payload": Object {
            "data": undefined,
            "testId": 2,
            "text": "Expect \\"[data-test=\\"text\\"]\\" to contain \\"foo\\"",
          },
          "type": "STEP",
        },
        Object {
          "meta": Object {
            "id": "mock",
          },
          "payload": Object {
            "error": "Expected \\"[data-test=\\"text\\"]\\" to include \\"foo\\". Actual: \\"abc\\".",
            "testId": 2,
          },
          "type": "TEST_FAIL",
        },
        Object {
          "meta": Object {
            "id": "mock",
          },
          "payload": Object {
            "success": false,
          },
          "type": "RESULT",
        },
        "flush",
      ]
    `);
  });
});
