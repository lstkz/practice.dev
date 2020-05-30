import { TestConfiguration } from '@pvd/tester';

export default {
  handler({ tester, url }) {
    tester.test('navigate to page', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    tester.test('text should equal to "foo"', async () => {
      await tester.getPage().expectToMatch('@text', 'foo', true);
    });
  },
} as TestConfiguration;
