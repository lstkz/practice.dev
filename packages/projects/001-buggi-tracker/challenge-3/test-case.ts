import { TestConfiguration } from '@pvd/tester';

export default {
  handler({ tester, url }) {
    tester.test('navigate to page', async () => {
      await tester.createPage();
      const page = await tester.getPage();
      await page.navigate(url);
    });
  },
} as TestConfiguration;
