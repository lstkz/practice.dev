import { resetDb } from '../helper';
import { registerSampleUsers, addSampleChallenges } from '../seed-data';
import { DiscussionCommentEntity } from '../../src/entities/DiscussionCommentEntity';
import { deleteComment } from '../../src/contracts/discussion/deleteComment';
import { makeAdmin } from '../../src/contracts/user/makeAdmin';

const userId = '1';

beforeEach(async () => {
  await resetDb();
  await Promise.all([registerSampleUsers(), addSampleChallenges()]);
  const entities = [
    new DiscussionCommentEntity({
      commentId: '100',
      createdAt: 100,
      text: '1',
      userId,
      challengeId: 1,
      parentCommentId: null,
    }),
  ];

  await Promise.all(entities.map(item => item.insert()));
});

it('should delete comment', async () => {
  await deleteComment('1', '100');
  const comment = await DiscussionCommentEntity.getByIdOrNull('100');
  expect(comment?.isDeleted).toEqual(true);
});

it('should delete comment as admin', async () => {
  await makeAdmin('2');
  await deleteComment('2', '100');
  const comment = await DiscussionCommentEntity.getByIdOrNull('100');
  expect(comment?.isDeleted).toEqual(true);
});

it('should throw an error if not found', async () => {
  await expect(deleteComment('1', '1123')).rejects.toThrow('Comment not found');
});

it('should throw an error if not author', async () => {
  await expect(deleteComment('2', '100')).rejects.toThrow('No permissions');
});

it('should throw an error if already deleted', async () => {
  await deleteComment('1', '100');
  await expect(deleteComment('1', '100')).rejects.toThrow('Already deleted');
});
