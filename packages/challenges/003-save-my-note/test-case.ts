import { TestConfiguration } from '@pvd/tester';

export default {
  page: 'single',
  handler({ tester, url }) {
    tester.test('navigate to page', async () => {
      await tester.createPage();
      await tester.getPage().navigate(url);
    });

    tester.test('verify note input and buttons are visible', async () => {
      await tester.getPage().expectToBeVisible('@note input');
      await tester.getPage().expectToBeVisible('@save-btn');
      await tester.getPage().expectToBeVisible('@load-btn');
    });

    tester.test('note should be empty by default', async () => {
      await tester.getPage().expectToMatch('@note input', '', true);
    });

    tester.test('enter note and save it', async () => {
      await tester.getPage().click('@increase-btn');
    });

    tester.test('click increment button 2 times', async () => {
      await tester.getPage().click('@decrease-btn');
      await tester.getPage().expectToMatch('@count-value', '2', true);
      await tester.getPage().click('@decrease-btn');
      await tester.getPage().expectToMatch('@count-value', '1', true);
    });
  },
} as TestConfiguration;
