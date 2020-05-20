import { TestConfiguration } from 'tester';

export default {
  page: 'single',
  handler({ tester, url }) {
    tester.test('navigate to page', async () => {
      await tester.navigate(url);
    });

    tester.test('text should equal to "bar"', async () => {
      await tester.expectToMatch('@text', 'bar', true);
    });
  },
} as TestConfiguration;
