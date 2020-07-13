const chromium = process.env.AWS ? require('chrome-aws-lambda') : null;
const puppeteer = process.env.AWS
  ? require('puppeteer-core')
  : require('puppeteer');

/**
 * @param {any} options
 * @returns {import('puppeteer').Browser}
 */
function connect(options) {
  return puppeteer.connect(options);
}

/**
 * @param {{ headless: boolean }} options
 */
async function launch({ headless }) {
  return await puppeteer.launch(
    process.env.AWS
      ? {
          args: [...chromium.args, '--window-size=1920,1080'],
          executablePath: await chromium.executablePath,
          headless,
          defaultViewport: null,
        }
      : {
          args: [
            '--disable-extensions',
            '--disable-infobars',
            '--disable-notifications',
            '--disable-offer-store-unmasked-wallet-cards',
            '--disable-offer-upload-credit-cards',
            '--enable-async-dns',
            '--enable-simple-cache-backend',
            '--enable-tcp-fast-open',
            '--password-store=basic',
            '--disable-translate',
            '--disable-cloud-import',
            '--no-first-run',
            '--start-maximized',
          ],
          headless,
          devtools: !headless,
          defaultViewport: null,
        }
  );
}

module.exports = {
  connect,
  launch,
};
