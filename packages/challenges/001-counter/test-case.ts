import { TestConfiguration } from 'tester';

export default {
  page: 'single',
  handler({ tester, url }) {
    tester.test('navigate to page', () => {
      tester.navigate(url);
    });

    tester.test(
      'verify count label, increase and decrease buttons are visible',
      () => {
        tester.expectToBeVisible('@count-value');
        tester.expectToBeVisible('@increase-btn');
        tester.expectToBeVisible('@decrease-btn');
      }
    );

    tester.test('count should display 0 by default', () => {
      tester.expectToMatch('@count-value', '0', true);
    });

    tester.test('click increment button 3 times', () => {
      tester.click('@increase-btn');
      tester.expectToMatch('@count-value', '1', true);
      tester.click('@increase-btn');
      tester.expectToMatch('@count-value', '2', true);
      tester.click('@increase-btn');
      tester.expectToMatch('@count-value', '3', true);
    });

    tester.test('click increment button 2 times', () => {
      tester.click('@decrease-btn');
      tester.expectToMatch('@count-value', '2', true);
      tester.click('@decrease-btn');
      tester.expectToMatch('@count-value', '1', true);
    });
  },
} as TestConfiguration;
