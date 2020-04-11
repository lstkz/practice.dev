const NodeEnvironment = require('jest-environment-node');
const fs = require('fs');
const path = require('path');
const { connect } = require('./puppeteer');

/**
 * @param {string} name
 */
function getFile(name) {
  const prefix = process.env.FILE_PREFIX || '';
  return path.join('/tmp', prefix + name);
}

const socketPath = getFile('browserWSEndpoint');

/**
 * @type {import('puppeteer').Browser}
 */
var browser;

/**
 * @returns {NodeJS.Global & {page: import('puppeteer').Page}}
 */
const getGlobal = () => {
  // @ts-ignore
  return global;
};

async function getPage() {
  const global = getGlobal();
  const pages = await browser.pages();
  if (!pages.length) {
    return await browser.newPage();
  }
  if (!global.page) {
    return pages[0];
  }
  return global.page;
}

class CustomEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();
    const socket = fs.readFileSync(socketPath, 'utf8');
    browser = await connect({
      browserWSEndpoint: socket,
      defaultViewport: null,
    });
    const global = getGlobal();
    const page = await getPage();
    this.global.page = page;
    global.page = page;
    page.removeAllListeners();
    await page.goto('about:blank');
  }
}

module.exports = CustomEnvironment;
