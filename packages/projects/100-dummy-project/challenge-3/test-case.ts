import { TestConfiguration } from '@pvd/tester';

export default {
  page: 'single',
  handler({ tester, url }) {
    tester.test('navigate to page', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    tester.test('text should equal to "baz"', async () => {
      await tester.getPage().expectToMatch('@text', 'baz', true);
    });
  },
} as TestConfiguration;
