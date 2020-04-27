import { resetDb, initDb } from '../helper';
import { registerSampleUsers, addSampleChallenges } from '../seed-data';
import { SubmissionStatus } from 'shared';
import { searchSubmissions } from '../../src/contracts/submission/searchSubmissions';
import { SubmissionCollection } from '../../src/collections/Submission';

beforeAll(async () => {
  await initDb();
});

beforeEach(async () => {
  await resetDb();
  await Promise.all([registerSampleUsers(), addSampleChallenges()]);

  await SubmissionCollection.insertMany([
    {
      _id: 1,
      userId: 1,
      createdAt: new Date(1),
      challengeId: 1,
      testUrl: 'https://example.org',
      status: SubmissionStatus.Queued,
    },
    {
      _id: 2,
      userId: 1,
      createdAt: new Date(2),
      challengeId: 1,
      testUrl: 'https://example.org',
      status: SubmissionStatus.Queued,
    },
    {
      _id: 3,
      userId: 2,
      createdAt: new Date(3),
      challengeId: 2,
      testUrl: 'https://example.org',
      status: SubmissionStatus.Queued,
    },
    {
      _id: 4,
      userId: 1,
      createdAt: new Date(4),
      challengeId: 2,
      testUrl: 'https://example.org',
      status: SubmissionStatus.Queued,
    },
  ]);
});

it('search by challengeId', async () => {
  const { items } = await searchSubmissions({
    challengeId: 1,
    limit: 10,
  });
  expect(items).toMatchInlineSnapshot(`
    Array [
      Object {
        "challengeId": 1,
        "createdAt": "1970-01-01T00:00:00.002Z",
        "id": 2,
        "status": "QUEUED",
        "user": Object {
          "id": 1,
          "username": "user1",
        },
      },
      Object {
        "challengeId": 1,
        "createdAt": "1970-01-01T00:00:00.001Z",
        "id": 1,
        "status": "QUEUED",
        "user": Object {
          "id": 1,
          "username": "user1",
        },
      },
    ]
  `);
});

it('search by username', async () => {
  const { items } = await searchSubmissions({
    username: 'user2',
    limit: 10,
  });
  expect(items).toMatchInlineSnapshot(`
    Array [
      Object {
        "challengeId": 2,
        "createdAt": "1970-01-01T00:00:00.003Z",
        "id": 3,
        "status": "QUEUED",
        "user": Object {
          "id": 2,
          "username": "user2",
        },
      },
    ]
  `);
});

it('search by username and challengeId', async () => {
  const { items } = await searchSubmissions({
    username: 'user1',
    challengeId: 2,
    limit: 10,
  });

  expect(items).toMatchInlineSnapshot(`
    Array [
      Object {
        "challengeId": 2,
        "createdAt": "1970-01-01T00:00:00.004Z",
        "id": 4,
        "status": "QUEUED",
        "user": Object {
          "id": 1,
          "username": "user1",
        },
      },
    ]
  `);
});

it('should paginate properly', async () => {
  const ret = await searchSubmissions({
    challengeId: 1,
    limit: 1,
  });

  expect(ret).toMatchInlineSnapshot(`
    Object {
      "cursor": "Mg==.4678ba2fff",
      "items": Array [
        Object {
          "challengeId": 1,
          "createdAt": "1970-01-01T00:00:00.002Z",
          "id": 2,
          "status": "QUEUED",
          "user": Object {
            "id": 1,
            "username": "user1",
          },
        },
      ],
    }
  `);

  const ret2 = await searchSubmissions({
    challengeId: 1,
    limit: 1,
    cursor: ret.cursor,
  });
  expect(ret2).toMatchInlineSnapshot(`
    Object {
      "cursor": "MQ==.73596befbc",
      "items": Array [
        Object {
          "challengeId": 1,
          "createdAt": "1970-01-01T00:00:00.001Z",
          "id": 1,
          "status": "QUEUED",
          "user": Object {
            "id": 1,
            "username": "user1",
          },
        },
      ],
    }
  `);
});
