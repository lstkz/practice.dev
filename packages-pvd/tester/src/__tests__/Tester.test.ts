process.env.DEFAULT_WAIT_TIME = '100';

import http from 'http';
import { S } from 'schema';
import { Tester, StepNotifier } from '../Tester';
import { launch } from '../puppeteer';
import { Page, Browser } from 'puppeteer';
import { getBody } from './helper';

class TestNotifier implements StepNotifier {
  actions: any[] = [];

  async notify(text: string, data?: any) {
    if (data) {
      this.actions.push({ text, data });
    } else {
      this.actions.push(text);
    }
  }
}

const port = 6899;
let tester: Tester;
let notifier: TestNotifier;

beforeEach(async () => {
  notifier = new TestNotifier();
  tester = new Tester(notifier);
});

async function runTests() {
  for (const test of tester.tests) {
    await test.exec();
  }
}

describe('frontend', () => {
  let page: Page;
  let server: http.Server;
  let browser: Browser;

  beforeAll(async () => {
    browser = await launch({
      headless: true,
    });
    page = await browser.newPage();
    server = http.createServer((req, res) => {
      res.writeHead(200, {
        'content-type': 'text/html',
      });
      res.write(`<!DOCTYPE html>
<html lang="en">
<head>
</head>
<body>
</body>
</html>
    `);
      res.end();
    });
    await new Promise(resolve => server.listen(port, resolve));
    await page.goto('http://localhost:' + port);
  });

  afterAll(async done => {
    await browser.close();
    server.close(done);
  });

  beforeEach(async () => {
    tester.page = page;
    await page.evaluate(() => {
      document.body.innerHTML = '';
    });
  });

  describe('click', () => {
    it('should click properly', async () => {
      await page.evaluate(() => {
        const btn = document.createElement('button');
        let count = 0;
        btn.addEventListener('click', () => {
          count++;
          btn.value = 'clicks ' + count;
        });
        btn.setAttribute('data-test', 'foo');
        document.body.appendChild(btn);
      });
      tester.test('example', async () => {
        await tester.click('@foo');
      });
      await runTests();
      const result = await page.evaluate(() => {
        const btn = document.querySelector('button');
        return btn!.value;
      });
      expect(result).toMatch('clicks 1');
    });

    it('should throw an error if not found', async () => {
      tester.test('example', async () => {
        await tester.click('@foo');
      });
      await expect(runTests()).rejects.toThrow(
        'waiting for selector "[data-test="foo"]" failed'
      );
    });
  });

  describe('navigate', () => {
    it('should navigate properly', async () => {
      // hard to test without mocking
      const page = {
        goto: jest.fn(),
      };
      tester.page = page as any;
      tester.test('example', async () => {
        await tester.navigate('http://example.com');
      });
      await runTests();
      expect(page.goto).toBeCalledWith('http://example.com', {
        timeout: 5000,
        waitUntil: 'domcontentloaded',
      });
      expect(notifier.actions).toEqual(['Navigate to "http://example.com"']);
    });
  });

  describe('expectToBeVisible', () => {
    it('should expected to be visible properly', async () => {
      await page.evaluate(() => {
        const btn = document.createElement('button');
        btn.setAttribute('data-test', 'foo');
        document.body.appendChild(btn);
      });
      tester.test('example', async () => {
        await tester.expectToBeVisible('@foo');
      });
      await runTests();
      expect(notifier.actions).toEqual([
        'Expect "[data-test="foo"]" to be visible',
      ]);
    });

    it('should throw an error if does not exist', async () => {
      tester.test('example', async () => {
        await tester.expectToBeVisible('@foo');
      });
      await expect(runTests()).rejects.toThrow(
        'waiting for selector "[data-test="foo"]" failed'
      );
    });

    it('should throw an error if hidden', async () => {
      await page.evaluate(() => {
        const btn = document.createElement('button');
        btn.setAttribute('data-test', 'foo');
        btn.style.display = 'none';
        document.body.appendChild(btn);
      });
      tester.test('example', async () => {
        await tester.expectToBeVisible('@foo');
      });
      await expect(runTests()).rejects.toThrow(
        'waiting for selector "[data-test="foo"]" failed'
      );
    });
  });

  describe('expectToMatch', () => {
    function addDiv() {
      return page.evaluate(() => {
        const div = document.createElement('div');
        div.setAttribute('data-test', 'foo');
        div.textContent = 'lorem';
        document.body.appendChild(div);
      });
    }
    describe('partial', () => {
      it('should match properly', async () => {
        await addDiv();
        tester.test('example', async () => {
          await tester.expectToMatch('@foo', 'lor');
        });
        await runTests();
        expect(notifier.actions).toEqual([
          'Expect "[data-test="foo"]" to contain "lor"',
        ]);
      });
      it('should throw an error if does not match', async () => {
        await addDiv();
        tester.test('example', async () => {
          await tester.expectToMatch('@foo', 'qwe');
        });
        await expect(runTests()).rejects.toThrow(
          'Expected "[data-test="foo"]" to include "qwe". Actual: "lorem".'
        );
      });
      it('should throw an error if does not exist', async () => {
        tester.test('example', async () => {
          await tester.expectToMatch('@foo', 'qwe');
        });
        await expect(runTests()).rejects.toThrow(
          'waiting for selector "[data-test="foo"]" failed'
        );
      });
      it('should throw an error if multiple results', async () => {
        await addDiv();
        await addDiv();
        tester.test('example', async () => {
          await tester.expectToMatch('@foo', 'qwe');
        });
        await expect(runTests()).rejects.toThrow(
          'Found 2 elements with selector "[data-test="foo"]". Expected only 1.'
        );
      });
    });
    describe('exact', () => {
      it('should match properly', async () => {
        await addDiv();
        tester.test('example', async () => {
          await tester.expectToMatch('@foo', 'lorem', true);
        });
        await runTests();
        expect(notifier.actions).toEqual([
          'Expect "[data-test="foo"]" to equal "lorem"',
        ]);
      });
      it('should throw an error if does not match', async () => {
        await addDiv();
        tester.test('example', async () => {
          await tester.expectToMatch('@foo', 'lor', true);
        });
        await expect(runTests()).rejects.toThrow(
          'Expected "[data-test="foo"]" to equal "lor". Actual: "lorem".'
        );
      });
    });
  });
});

describe('api', () => {
  let server: http.Server;
  let handler: (
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) => Promise<void> | void;

  beforeAll(async () => {
    server = http.createServer(async (req, res) => {
      if (handler) {
        handler(req, res);
      } else {
        res.writeHead(404);
        res.end();
      }
    });
    await new Promise(resolve => server.listen(port, resolve));
  });

  afterAll(done => {
    server.close(done);
  });

  beforeEach(() => {
    handler = null!;
    tester.setBaseApiUrl('http://localhost:' + port);
  });

  describe('makeRequest', () => {
    it('should make GET request', async () => {
      handler = (req, res) => {
        if (req.method === 'GET' && req.url === '/foo') {
          res.write(JSON.stringify({ test: 'foo' }));
          res.end();
        } else {
          res.writeHead(404);
          res.end();
        }
      };

      const [body, res] = await tester.makeRequest({
        method: 'GET',
        path: '/foo',
      });

      expect(res.statusCode).toEqual(200);
      expect(body).toEqual({ test: 'foo' });
      expect(notifier.actions).toMatchInlineSnapshot(`
        Array [
          "Make request 1 GET http://localhost:6899/foo",
          Object {
            "data": Object {
              "body": Object {
                "test": "foo",
              },
              "status": 200,
            },
            "text": "Response from request 1",
          },
        ]
      `);
    });

    it('should make POST request', async () => {
      handler = (req, res) => {
        if (req.method === 'POST' && req.url === '/foo') {
          getBody(req).then((body: any) => {
            res.write(
              JSON.stringify({
                ...body,
                foo: 'bar',
              })
            );
            res.end();
          });
        } else {
          res.writeHead(404);
          res.end();
        }
      };

      const [body, res] = await tester.makeRequest({
        method: 'POST',
        path: '/foo',
        body: { test: 'foo' },
      });

      expect(res.statusCode).toEqual(200);
      expect(body).toEqual({ test: 'foo', foo: 'bar' });
      expect(notifier.actions).toMatchInlineSnapshot(`
        Array [
          Object {
            "data": Object {
              "body": Object {
                "test": "foo",
              },
            },
            "text": "Make request 1 POST http://localhost:6899/foo",
          },
          Object {
            "data": Object {
              "body": Object {
                "foo": "bar",
                "test": "foo",
              },
              "status": 200,
            },
            "text": "Response from request 1",
          },
        ]
      `);
    });

    // this test causes
    // "Jest did not exit one second after the test run has completed."
    it('should throw error if cannot connect', async () => {
      tester.setBaseApiUrl('http://localhost:' + (port + 1));
      await expect(
        tester.makeRequest({
          method: 'GET',
          path: '/foo',
        })
      ).rejects.toThrow('Cannot connect to server: connect ECONNREFUSED');
    });
  });
});

describe('common', () => {
  describe('expectStatus', () => {
    it('should expect status correctly', async () => {
      await tester.expectStatus(
        {
          statusCode: 200,
        } as http.IncomingMessage,
        200
      );
      expect(notifier.actions).toEqual(['Expect status to equal "200"']);
    });

    it('should throw an error if status does not match', async () => {
      await expect(
        tester.expectStatus(
          {
            statusCode: 200,
          } as http.IncomingMessage,
          400
        )
      ).rejects.toThrow('Expected status to equal "400". Actual: "200".');
    });
  });

  describe('expectEqual', () => {
    it('should assert correctly', async () => {
      await tester.expectEqual({ foo: 'name' }, { foo: 'name' }, 'user');
      expect(notifier.actions).toEqual([
        'Expect "user" to equal "{"foo":"name"}"',
      ]);
    });

    it('should throw an error if does not match', async () => {
      await expect(
        tester.expectEqual({ foo: 'name' }, { foo: 'bar' }, 'user')
      ).rejects.toThrow(
        'Expected "user" to equal "{"foo":"bar"}". Actual: "{"foo":"name"}".'
      );
    });
  });

  describe('expectSchema', () => {
    it('should assert correctly', async () => {
      await tester.expectSchema(
        { isValid: true },
        S.object().keys({
          isValid: S.boolean(),
        }),
        'body',
        'ValidationResult'
      );
      expect(notifier.actions).toEqual([
        'Expect "body" to match "ValidationResult" schema.',
      ]);
    });

    it('should throw an error if does not match', async () => {
      await expect(
        tester.expectSchema(
          { foo: true },
          S.object().keys({
            isValid: S.boolean(),
          }),
          'body',
          'ValidationResult'
        )
      ).rejects.toThrow(
        "'body.isValid' is required. 'body.foo' is not allowed."
      );
    });
  });
});
