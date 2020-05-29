import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { UserEntity } from '../../entities';
import { DiscussionCommentEntity } from '../../entities/DiscussionCommentEntity';
import { AppError } from '../../common/errors';

export const deleteComment = createContract('discussion.deleteComment')
  .params('userId', 'id')
  .schema({
    userId: S.string(),
    id: S.string(),
  })
  .fn(async (userId, id) => {
    const [user, comment] = await Promise.all([
      UserEntity.getById(userId),
      DiscussionCommentEntity.getByIdOrNull(id),
    ]);
    if (!comment) {
      throw new AppError('Comment not found');
    }
    if (!user.isAdmin && user.userId !== comment.userId) {
      throw new AppError('No permissions');
    }
    if (comment.isDeleted) {
      throw new AppError('Comment is already deleted');
    }
    comment.text = null;
    comment.html = null;
    comment.isDeleted = true;
    await comment.update(['isDeleted', 'text']);
  });

export const deleteCommentRpc = createRpcBinding({
  verified: true,
  injectUser: true,
  signature: 'discussion.deleteComment',
  handler: deleteComment,
});
