import { resetDb } from '../helper';
import { updateChallenge } from '../../src/contracts/challenge/updateChallenge';
import { registerSampleUsers } from '../seed-data';
import { getChallengeTags } from '../../src/contracts/challenge/getChallengeTags';

beforeEach(async () => {
  await resetDb();
  await Promise.all([registerSampleUsers(), insertSampleData()]);
});

async function insertSampleData() {
  await Promise.all([
    updateChallenge({
      id: 1,
      title: 'c1',
      description: 'd1',
      detailsBundleS3Key: 'http://example.org',
      testsBundleS3Key: 'http://example.org/testsBundleS3Key',
      domain: 'frontend',
      difficulty: 'easy',
      tags: ['foo'],
      testCase: 'a',
    }),
    updateChallenge({
      id: 2,
      title: 'c2',
      description: 'd2',
      detailsBundleS3Key: 'http://example.org',
      testsBundleS3Key: 'http://example.org/testsBundleS3Key',
      domain: 'frontend',
      difficulty: 'easy',
      tags: ['foo', 'bar'],
      testCase: 'a',
    }),
    updateChallenge({
      id: 3,
      title: 'c3',
      description: 'd3',
      detailsBundleS3Key: 'http://example.org',
      testsBundleS3Key: 'http://example.org/testsBundleS3Key',
      domain: 'frontend',
      difficulty: 'hard',
      tags: ['tag2'],
      testCase: 'a',
    }),
  ]);
}

it('should return challenge tags', async () => {
  const result = await getChallengeTags();
  expect(result).toMatchInlineSnapshot(`
    Array [
      Object {
        "count": 2,
        "name": "foo",
      },
      Object {
        "count": 1,
        "name": "bar",
      },
      Object {
        "count": 1,
        "name": "tag2",
      },
    ]
  `);
});
