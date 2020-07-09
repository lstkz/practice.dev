import { S } from 'schema';
import { createContract, createEventBinding } from '../../lib';
import { UserEntity, DiscussionSubscriptionEntity } from '../../entities';
import { DiscussionCommentEntity } from '../../entities/DiscussionCommentEntity';
import {
  getChallengeOrProjectChallenge,
  getChallengeUrl,
} from '../../common/baseChallenge';
import { esSearch } from '../../common/elastic';
import { AnyChallenge } from '../../types';
import { sendEmail } from '../../common/helper';

function _getAdmins() {
  return esSearch(UserEntity, {
    query: {
      bool: {
        must: { match: { isAdmin: true } },
      },
    },
    limit: 10,
    sort: [{ _id: 'asc' }],
  });
}

async function _notifyAdmins(
  comment: DiscussionCommentEntity,
  originalComment: DiscussionCommentEntity | null,
  authorUser: UserEntity,
  challenge: AnyChallenge
) {
  const admins = await _getAdmins();
  const challengeUrl = getChallengeUrl(challenge);
  const commentType = originalComment ? 'reply' : 'question';
  await Promise.all(
    admins.items.map(admin => {
      if (authorUser.userId === admin.userId) {
        return;
      }
      return sendEmail({
        to: admin.email,
        subject: `New ${commentType} in "${challenge.title}" by ${authorUser.username}`,
        message: `
Hi ${admin.username},
<br/>
<br/>
Here is a new ${commentType}.
<br/>
<br/>
------------------------------------------------------------------------
<br/>
<br/>
  Challenge: <a href="${challengeUrl}">${challenge.title}</a><br/>
  <br/><br/>
  Message: <br/>
  ${comment.html} 
<br/>
<br/>
------------------------------------------------------------------------
<br/>
<br/>
Practice.dev
`.trim(),
      });
    })
  );
}

export const onNewDiscussion = createContract('notification.onNewDiscussion')
  .params('commentId')
  .schema({
    commentId: S.string(),
  })
  .fn(async commentId => {
    const comment = await DiscussionCommentEntity.getById(commentId);
    const [
      originalComment,
      authorUser,
      subscriptions,
      challenge,
    ] = await Promise.all([
      comment.parentCommentId
        ? DiscussionCommentEntity.getById(comment.parentCommentId)
        : Promise.resolve(null),
      UserEntity.getById(comment.userId),
      comment.parentCommentId
        ? DiscussionSubscriptionEntity.getAllCommentSubscription(
            comment.parentCommentId
          )
        : Promise.resolve([]),
      getChallengeOrProjectChallenge(undefined, {
        projectId: comment.projectId,
        challengeId: comment.challengeId,
      }),
    ]);

    await _notifyAdmins(comment, originalComment, authorUser, challenge);
    if (!originalComment) {
      return;
    }

    await Promise.all(
      subscriptions.map(async subscription => {
        if (comment.userId === subscription.userId) {
          return;
        }
        const targetUser = await UserEntity.getById(subscription.userId);
        const challengeUrl = getChallengeUrl(challenge);
        await sendEmail({
          to: targetUser.email,
          subject: `New reply in "${challenge.title}" by ${authorUser.username}`,
          message: `
Hi ${targetUser.username},
<br/>
<br/>
Here is a new reply for a question you posted.
<br/>
<br/>
------------------------------------------------------------------------
<br/>
<br/>
  Challenge: <a href="${challengeUrl}">${challenge.title}</a><br/>
  Your question: <br/>
  ${originalComment.html} 
  <br/><br/>
  Message: <br/>
  ${comment.html} 
<br/>
<br/>
------------------------------------------------------------------------
<br/>
<br/>
<a href="${challengeUrl}?unsubscribe=${comment.parentCommentId}">Click here to unsubscribe from the thread</a> 
<br/>
<br/>
Practice.dev
          `.trim(),
        });
      })
    );
  });

export const onNewDiscussionEvent = createEventBinding({
  type: 'NewDiscussionEvent',
  handler(event) {
    return onNewDiscussion(event.payload.commentId);
  },
});
