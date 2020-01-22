import { TestConfiguration } from 'tester';

export default {
  page: 'single',
  handler({ tester, url }) {
    tester.test('navigate to page', async () => {
      await tester.navigate(url);
    });

    tester.test(
      'verify count label, increase and decrease buttons are visible',
      async () => {
        await tester.expectToBeVisible('@count-value');
        await tester.expectToBeVisible('@increase-btn');
        await tester.expectToBeVisible('@decrease-btn');
      }
    );

    tester.test('count should display 0 by default', async () => {
      await tester.expectToMatch('@count-value', '0', true);
    });

    tester.test('click increment button 3 times', async () => {
      await tester.click('@increase-btn');
      await tester.expectToMatch('@count-value', '1', true);
      await tester.click('@increase-btn');
      await tester.expectToMatch('@count-value', '2', true);
      await tester.click('@increase-btn');
      await tester.expectToMatch('@count-value', '3', true);
    });

    tester.test('click increment button 2 times', async () => {
      await tester.click('@decrease-btn');
      await tester.expectToMatch('@count-value', '2', true);
      await tester.click('@decrease-btn');
      await tester.expectToMatch('@count-value', '1', true);
    });
  },
} as TestConfiguration;
