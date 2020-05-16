import { resetDb } from '../helper';
import { registerSampleUsers, addSampleChallenges } from '../seed-data';
import { createComment } from '../../src/contracts/discussion/createComment';

const userId = '1';

beforeEach(async () => {
  await resetDb();
  await Promise.all([registerSampleUsers(), addSampleChallenges()]);
});

it('should create a comment successfully', async () => {
  const comment = await createComment(userId, {
    parentCommentId: null,
    challengeId: 1,
    text: 'foo',
  });
  expect(comment.id).toBeDefined();
  expect(comment.isAnswered).toEqual(false);
  expect(comment.text).toEqual('foo');
  expect(comment.challengeId).toEqual(1);
  expect(comment.user.username).toEqual('user1');
  const sub = await createComment(userId, {
    parentCommentId: comment.id,
    challengeId: 1,
    text: 'bar',
  });
  expect(sub.text).toEqual('bar');
  expect(sub.parentCommentId).toEqual(comment.id);
});

it('should throw an error if challenge not found', async () => {
  await expect(
    createComment(userId, {
      parentCommentId: null,
      challengeId: 12344,
      text: 'foo',
    })
  ).rejects.toThrowError('Challenge not found');
});

it('should throw an error if parent comment is not found', async () => {
  await expect(
    createComment(userId, {
      parentCommentId: 'aqw',
      challengeId: 1,
      text: 'foo',
    })
  ).rejects.toThrowError('Parent comment not found');
});

it('should throw an error if parent comment is not root', async () => {
  const c1 = await createComment(userId, {
    parentCommentId: null,
    challengeId: 1,
    text: 'foo',
  });
  const c2 = await createComment(userId, {
    parentCommentId: c1.id,
    challengeId: 1,
    text: 'foo',
  });
  await expect(
    createComment(userId, {
      parentCommentId: c2.id,
      challengeId: 1,
      text: 'foo',
    })
  ).rejects.toThrowError('Parent comment is not a root comment');
});

it('should throw an error if parent comment is from different challenge', async () => {
  const c1 = await createComment(userId, {
    parentCommentId: null,
    challengeId: 1,
    text: 'foo',
  });
  await expect(
    createComment(userId, {
      parentCommentId: c1.id,
      challengeId: 2,
      text: 'foo',
    })
  ).rejects.toThrowError('Invalid parent comment');
});
