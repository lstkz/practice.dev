process.env.DEFAULT_WAIT_TIME = '100';

import http from 'http';
import { Tester, StepNotifier } from '../Tester';
import { launch } from '../puppeteer';
import { Page, Browser } from 'puppeteer';

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

let tester: Tester;
let notifier: TestNotifier;
let page: Page;
let server: http.Server;
let browser: Browser;

beforeAll(async () => {
  const port = 6899;
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

afterAll(async () => {
  try {
    await browser.close();
  } catch (e) {}
  try {
    server.close();
  } catch (e) {}
});

beforeEach(async () => {
  notifier = new TestNotifier();
  tester = new Tester(notifier);
  tester.page = page;
  await page.evaluate(() => {
    document.body.innerHTML = '';
  });
});

async function runTests() {
  for (const test of tester.tests) {
    await test.exec();
  }
}

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
