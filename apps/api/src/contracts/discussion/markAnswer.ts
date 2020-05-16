import { S } from 'schema';
import { createContract, createRpcBinding, createTransaction } from '../../lib';
import { DiscussionCommentEntity } from '../../entities/DiscussionCommentEntity';
import { AppError } from '../../common/errors';

export const markAnswer = createContract('discussion.markAnswer')
  .params('id')
  .schema({
    id: S.string(),
  })
  .fn(async id => {
    const comment = await DiscussionCommentEntity.getByIdOrNull(id);
    if (!comment) {
      throw new AppError('Comment not found');
    }
    if (!comment.parentCommentId) {
      throw new AppError('Only child comment can be mark as answered');
    }
    const parent = await DiscussionCommentEntity.getById(
      comment.parentCommentId
    );
    parent.isAnswered = true;
    comment.isAnswer = true;
    const t = createTransaction();
    t.update(parent, ['isAnswered']);
    t.update(comment, ['isAnswer']);
    await t.commit();
  });

export const markAnswerRpc = createRpcBinding({
  admin: true,
  signature: 'discussion.markAnswer',
  handler: markAnswer,
});
