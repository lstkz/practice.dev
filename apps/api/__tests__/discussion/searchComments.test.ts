import { resetDb, esReIndexFromDynamo } from '../helper';
import { registerSampleUsers, addSampleChallenges } from '../seed-data';
import { DiscussionCommentEntity } from '../../src/entities/DiscussionCommentEntity';
import { searchComments } from '../../src/contracts/discussion/searchComments';

const userId = '1';

beforeEach(async () => {
  await resetDb();
  await Promise.all([registerSampleUsers(), addSampleChallenges()]);
  const entities = [
    // challenge 1
    // thread 1
    new DiscussionCommentEntity({
      commentId: '100',
      createdAt: 100,
      text: '1',
      userId,
      challengeId: 1,
      isAnswered: false,
      parentCommentId: null,
    }),
    new DiscussionCommentEntity({
      commentId: '101',
      createdAt: 101,
      text: '1.1',
      userId,
      challengeId: 1,
      isAnswered: false,
      parentCommentId: '100',
    }),
    new DiscussionCommentEntity({
      commentId: '102',
      createdAt: 102,
      text: '1.2',
      userId,
      challengeId: 1,
      isAnswered: false,
      parentCommentId: '100',
    }),
    new DiscussionCommentEntity({
      commentId: '100',
      createdAt: 100,
      text: '1',
      userId,
      challengeId: 1,
      isAnswered: false,
      parentCommentId: null,
    }),
    // thread 2
    new DiscussionCommentEntity({
      commentId: '200',
      createdAt: 200,
      text: '2',
      userId,
      challengeId: 1,
      isAnswered: false,
      parentCommentId: null,
    }),
    new DiscussionCommentEntity({
      commentId: '201',
      createdAt: 201,
      text: '2.1',
      userId,
      challengeId: 1,
      isAnswered: false,
      parentCommentId: '200',
    }),
    // challenge 2
    new DiscussionCommentEntity({
      commentId: '1000',
      createdAt: 1000,
      text: '1',
      userId,
      challengeId: 2,
      isAnswered: false,
      parentCommentId: null,
    }),
  ];
  await Promise.all(entities.map(item => item.insert()));
  await esReIndexFromDynamo(DiscussionCommentEntity.entityType);
});

it('should search comments', async () => {
  const ret = await searchComments({
    challengeId: 1,
    sortDesc: false,
  });
  expect(ret).toMatchInlineSnapshot(`
    Object {
      "cursor": null,
      "items": Array [
        Object {
          "challengeId": 1,
          "children": Array [
            Object {
              "challengeId": 1,
              "children": Array [],
              "createdAt": "1970-01-01T00:00:00.101Z",
              "id": "101",
              "isAnswer": false,
              "isAnswered": false,
              "isDeleted": false,
              "parentCommentId": "100",
              "text": "1.1",
              "user": Object {
                "avatarUrl": null,
                "id": "1",
                "username": "user1",
              },
            },
            Object {
              "challengeId": 1,
              "children": Array [],
              "createdAt": "1970-01-01T00:00:00.102Z",
              "id": "102",
              "isAnswer": false,
              "isAnswered": false,
              "isDeleted": false,
              "parentCommentId": "100",
              "text": "1.2",
              "user": Object {
                "avatarUrl": null,
                "id": "1",
                "username": "user1",
              },
            },
          ],
          "createdAt": "1970-01-01T00:00:00.100Z",
          "id": "100",
          "isAnswer": false,
          "isAnswered": false,
          "isDeleted": false,
          "parentCommentId": null,
          "text": "1",
          "user": Object {
            "avatarUrl": null,
            "id": "1",
            "username": "user1",
          },
        },
        Object {
          "challengeId": 1,
          "children": Array [
            Object {
              "challengeId": 1,
              "children": Array [],
              "createdAt": "1970-01-01T00:00:00.201Z",
              "id": "201",
              "isAnswer": false,
              "isAnswered": false,
              "isDeleted": false,
              "parentCommentId": "200",
              "text": "2.1",
              "user": Object {
                "avatarUrl": null,
                "id": "1",
                "username": "user1",
              },
            },
          ],
          "createdAt": "1970-01-01T00:00:00.200Z",
          "id": "200",
          "isAnswer": false,
          "isAnswered": false,
          "isDeleted": false,
          "parentCommentId": null,
          "text": "2",
          "user": Object {
            "avatarUrl": null,
            "id": "1",
            "username": "user1",
          },
        },
      ],
    }
  `);
});

it('should paginate', async () => {
  const ret = await searchComments({
    challengeId: 1,
    sortDesc: true,
    limit: 1,
  });
  expect(ret.items).toHaveLength(1);
  expect(ret.items[0].id).toEqual('200');
  const ret2 = await searchComments({
    challengeId: 1,
    sortDesc: true,
    limit: 1,
    cursor: ret.cursor,
  });
  expect(ret2.items).toHaveLength(1);
  expect(ret2.items[0].id).toEqual('100');
});
