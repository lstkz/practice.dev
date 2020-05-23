import { S } from 'schema';
import * as R from 'remeda';
import uuid from 'uuid';
import { createContract, createRpcBinding } from '../../lib';
import { UserEntity } from '../../entities';
import { AppError } from '../../common/errors';
import { DiscussionCommentEntity } from '../../entities/DiscussionCommentEntity';
import { doFn } from '../../common/helper';
import { validateChallengeOrProjectChallenge } from '../../common/validateChallengeOrProjectChallenge';

export const createComment = createContract('discussion.createComment')
  .params('userId', 'values')
  .schema({
    userId: S.string(),
    values: S.object().keys({
      parentCommentId: S.string().nullable().optional(),
      challengeId: S.number().min(1),
      projectId: S.number().min(1).optional(),
      text: S.string().trim().min(1).max(3000),
    }),
  })
  .fn(async (userId, values) => {
    const [user] = await Promise.all([
      UserEntity.getById(userId),
      validateChallengeOrProjectChallenge(
        userId,
        R.pick(values, ['projectId', 'challengeId'])
      ),
    ]);

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
      projectId: values.projectId,
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
