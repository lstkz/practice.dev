import { S } from 'schema';
import uuid from 'uuid';
import { createContract, createRpcBinding } from '../../lib';
import { ChallengeEntity, UserEntity } from '../../entities';
import { AppError } from '../../common/errors';
import { DiscussionCommentEntity } from '../../entities/DiscussionCommentEntity';
import { doFn } from '../../common/helper';

export const createComment = createContract('discussion.createComment')
  .params('userId', 'values')
  .schema({
    userId: S.string(),
    values: S.object().keys({
      parentCommentId: S.string().nullable().optional(),
      challengeId: S.number(),
      text: S.string().trim().min(1).max(3000),
    }),
  })
  .fn(async (userId, values) => {
    const [challenge, user] = await Promise.all([
      ChallengeEntity.getByKeyOrNull({
        challengeId: values.challengeId,
      }),
      UserEntity.getById(userId),
    ]);

    if (!challenge) {
      throw new AppError('Challenge not found');
    }
    const parentComment = await doFn(async () => {
      if (!values.parentCommentId) {
        return null;
      }
      if (values.parentCommentId.includes('_')) {
        throw new AppError('Parent comment is not a root comment');
      }
      const parent = await DiscussionCommentEntity.getByIdOrNull(
        values.parentCommentId
      );
      if (!parent) {
        throw new AppError('Parent comment not found');
      }
      if (parent.challengeId !== values.challengeId) {
        throw new AppError('Invalid parent comment');
      }
      return parent;
    });
    const commentId = parentComment
      ? `${parentComment.commentId}_${uuid()}`
      : uuid();
    const comment = new DiscussionCommentEntity({
      challengeId: values.challengeId,
      commentId,
      isAnswered: false,
      text: values.text,
      userId,
      parentCommentId: parentComment?.commentId,
      createdAt: Date.now(),
    });
    await comment.insert();
    return comment.toDiscussionComment(user);
  });

export const loginRpc = createRpcBinding({
  verified: true,
  injectUser: true,
  signature: 'discussion.createComment',
  handler: createComment,
});
