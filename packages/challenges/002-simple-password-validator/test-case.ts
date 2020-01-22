import { ApiTestConfiguration } from 'tester-api';

export default {
  handler({ tester, url }) {
    tester.setBaseUrl(url);

    tester.test('Validate valid passwords', () => {
      tester.makeRequest({
        method: 'POST',
        path: '/validate',
        body: {
          password: 'foobar!',
        },
      });
    });
  },
} as ApiTestConfiguration;
