import { S } from 'schema';
import * as R from 'remeda';
import uuid from 'uuid';
import { createContract, createRpcBinding, createTransaction } from '../../lib';
import { UserEntity, DiscussionSubscriptionEntity } from '../../entities';
import { AppError } from '../../common/errors';
import { DiscussionCommentEntity } from '../../entities/DiscussionCommentEntity';
import { doFn } from '../../common/helper';
import { validateChallengeOrProjectChallenge } from '../../common/baseChallenge';
import { dispatch } from '../../dispatch';
import { markdown } from '../../common/markdown';

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
      if (
        parent.challengeId !== values.challengeId ||
        parent.projectId !== values.projectId
      ) {
        throw new AppError('Invalid parent comment');
      }
      return parent;
    });
    const commentId = parentComment
      ? `${parentComment.commentId}_${uuid()}`
      : uuid();
    const t = createTransaction();
    if (!parentComment) {
      const subscription = new DiscussionSubscriptionEntity({
        commentId,
        userId,
      });
      t.insert(subscription);
    }
    const comment = new DiscussionCommentEntity({
      challengeId: values.challengeId,
      projectId: values.projectId,
      commentId,
      isAnswered: false,
      text: values.text,
      html: markdown(values.text),
      userId,
      parentCommentId: parentComment?.commentId,
      createdAt: Date.now(),
      type: values.projectId ? 'project' : 'challenge',
    });
    t.insert(comment);
    await t.commit();

    await dispatch({
      type: 'NewDiscussionEvent',
      payload: {
        commentId,
      },
    });

    return comment.toDiscussionComment(user);
  });

export const loginRpc = createRpcBinding({
  verified: true,
  injectUser: true,
  signature: 'discussion.createComment',
  handler: createComment,
});
