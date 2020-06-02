import http from 'http';
import { launch } from '../puppeteer';
import { Page, Browser } from 'puppeteer';
import { initFrontendServer, TEST_PORT } from './helper';
import { TesterPage } from '../TesterPage';
import { TestNotifier } from './TestNotifier';

let page: Page;
let server: http.Server;
let browser: Browser;
let tester: TesterPage;
let notifier: TestNotifier;

beforeAll(async () => {
  browser = await launch({
    headless: true,
  });
  page = await browser.newPage();
  server = await initFrontendServer(TEST_PORT);
  await page.goto('http://localhost:' + TEST_PORT);
});

afterAll(async done => {
  await browser.close();
  server.close(done);
});

beforeEach(async () => {
  notifier = new TestNotifier();
  tester = new TesterPage(notifier, page, 100);
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
    await tester.click('@foo');
    const result = await page.evaluate(() => {
      const btn = document.querySelector('button');
      return btn!.value;
    });
    expect(result).toMatch('clicks 1');
  });

  it('should throw an error if not found', async () => {
    await expect(tester.click('@foo')).rejects.toThrow(
      'waiting for selector "[data-test="foo"]" failed'
    );
  });
});

describe('navigate', () => {
  it('should navigate properly', async () => {
    await tester.navigate('http://localhost:' + TEST_PORT + '/bar');
    expect(notifier.actions).toEqual([
      'Navigate to "http://localhost:6899/bar"',
    ]);
  });
});

describe('expectToBeVisible', () => {
  it('should expected to be visible properly', async () => {
    await page.evaluate(() => {
      const btn = document.createElement('button');
      btn.setAttribute('data-test', 'foo');
      document.body.appendChild(btn);
    });
    await tester.expectToBeVisible('@foo');
    expect(notifier.actions).toEqual([
      'Expect "[data-test="foo"]" to be visible',
    ]);
  });

  it('should throw an error if does not exist', async () => {
    await expect(tester.expectToBeVisible('@foo')).rejects.toThrow(
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
    await expect(tester.expectToBeVisible('@foo')).rejects.toThrow(
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
      await tester.expectToMatch('@foo', 'lor');
      expect(notifier.actions).toEqual([
        'Expect "[data-test="foo"]" to contain "lor"',
      ]);
    });
    it('should throw an error if does not match', async () => {
      await addDiv();
      await expect(tester.expectToMatch('@foo', 'qwe')).rejects.toThrow(
        'Expected "[data-test="foo"]" to include "qwe". Actual: "lorem".'
      );
    });
    it('should throw an error if does not exist', async () => {
      await expect(tester.expectToMatch('@foo', 'qwe')).rejects.toThrow(
        'waiting for selector "[data-test="foo"]" failed'
      );
    });
    it('should throw an error if multiple results', async () => {
      await addDiv();
      await addDiv();
      await expect(tester.expectToMatch('@foo', 'qwe')).rejects.toThrow(
        'Found 2 elements with selector "[data-test="foo"]". Expected only 1.'
      );
    });
  });
  describe('exact', () => {
    it('should match properly', async () => {
      await addDiv();
      await tester.expectToMatch('@foo', 'lorem', true);
      expect(notifier.actions).toEqual([
        'Expect "[data-test="foo"]" to equal "lorem"',
      ]);
    });
    it('should throw an error if does not match', async () => {
      await addDiv();
      await expect(tester.expectToMatch('@foo', 'lor', true)).rejects.toThrow(
        'Expected "[data-test="foo"]" to equal "lor". Actual: "lorem".'
      );
    });
  });
});

describe('type', () => {
  it('should type properly', async () => {
    await page.evaluate(() => {
      const div = document.createElement('input');
      div.setAttribute('data-test', 'foo');
      document.body.appendChild(div);
    });
    await tester.type('@foo', 'bar');
    expect(notifier.actions).toEqual(['Type "bar" to "[data-test="foo"]"']);
    const value = await page.evaluate(() => {
      return document.querySelector('input')!.value;
    });
    expect(value).toEqual('bar');
  });
});

describe('expectToBeEnabled', () => {
  it('should match properly', async () => {
    await page.evaluate(() => {
      const btn = document.createElement('button');
      btn.setAttribute('data-test', 'foo');
      document.body.appendChild(btn);
    });
    await tester.expectToBeEnabled('@foo');
    expect(notifier.actions).toEqual([
      'Expect "[data-test="foo"]" to be enabled',
    ]);
  });

  it('should throw if disabled', async () => {
    await page.evaluate(() => {
      const btn = document.createElement('button');
      btn.setAttribute('data-test', 'foo');
      btn.setAttribute('disabled', '');
      document.body.appendChild(btn);
    });
    await expect(tester.expectToBeEnabled('@foo')).rejects.toThrow(
      'Expected "[data-test="foo"]" to be enabled, but it\'s still disabled'
    );
  });
});

describe('clear', () => {
  it('should clear properly', async () => {
    await page.evaluate(() => {
      const div = document.createElement('input');
      div.setAttribute('data-test', 'foo');
      div.value = 'value';
      document.body.appendChild(div);
    });
    await tester.clear('@foo');
    expect(notifier.actions).toEqual(['Clear "[data-test="foo"]"']);
    const value = await page.evaluate(() => {
      return document.querySelector('input')!.value;
    });
    expect(value).toEqual('');
  });
});
