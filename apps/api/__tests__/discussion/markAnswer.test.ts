import { resetDb } from '../helper';
import { registerSampleUsers, addSampleChallenges } from '../seed-data';
import { DiscussionCommentEntity } from '../../src/entities/DiscussionCommentEntity';
import { markAnswer } from '../../src/contracts/discussion/markAnswer';
import { createComment } from '../../src/contracts/discussion/createComment';
import { DiscussionComment } from 'shared';

let parentComment: DiscussionComment = null!;
let childComment: DiscussionComment = null!;

beforeEach(async () => {
  await resetDb();
  await Promise.all([registerSampleUsers(), addSampleChallenges()]);
  parentComment = await createComment('1', {
    challengeId: 1,
    text: 'foo',
  });
  childComment = await createComment('1', {
    challengeId: 1,
    text: 'foo',
    parentCommentId: parentComment.id,
  });
});

it('should throw an error if not found', async () => {
  await expect(markAnswer('1123')).rejects.toThrow('Comment not found');
});

it('should throw an error if not child', async () => {
  await expect(markAnswer(parentComment.id)).rejects.toThrow(
    'Only child comment can be mark as answered'
  );
});

it('should mark as answer', async () => {
  await markAnswer(childComment.id);
  const parent = await DiscussionCommentEntity.getById(parentComment.id);
  expect(parent.isAnswered).toEqual(true);
  const child = await DiscussionCommentEntity.getById(childComment.id);
  expect(child.isAnswer).toEqual(true);
});
