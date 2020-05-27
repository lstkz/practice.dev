import { S } from 'schema';
import { createContract, createEventBinding, ses } from '../../lib';
import { EMAIL_SENDER } from '../../config';
import { UserEntity, DiscussionSubscriptionEntity } from '../../entities';
import { DiscussionCommentEntity } from '../../entities/DiscussionCommentEntity';
import {
  getChallengeOrProjectChallenge,
  getChallengeUrl,
} from '../../common/baseChallenge';

export const onNewDiscussion = createContract('notification.onNewDiscussion')
  .params('commentId')
  .schema({
    commentId: S.string(),
  })
  .fn(async commentId => {
    const comment = await DiscussionCommentEntity.getById(commentId);
    if (!comment.parentCommentId) {
      // TODO: notify admin
      return;
    }
    const [originalComment, authorUser, subscriptions] = await Promise.all([
      DiscussionCommentEntity.getById(comment.parentCommentId),
      UserEntity.getById(comment.userId),
      DiscussionSubscriptionEntity.getAllCommentSubscription(
        comment.parentCommentId
      ),
    ]);

    await Promise.all(
      subscriptions.map(async subscription => {
        if (comment.userId === subscription.userId) {
          return;
        }
        const targetUser = await UserEntity.getById(subscription.userId);
        const challenge = await getChallengeOrProjectChallenge(
          targetUser.userId,
          {
            projectId: comment.projectId,
            challengeId: comment.challengeId,
          }
        );
        const challengeUrl = getChallengeUrl(challenge);
        await ses
          .sendEmail({
            Source: EMAIL_SENDER,
            Destination: {
              ToAddresses: [targetUser.email],
            },
            Message: {
              Subject: {
                Data: `New reply in "${challenge.title}" by ${authorUser.username}`,
              },
              Body: {
                Html: {
                  Data: `
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
   ${originalComment.text} 
   <br/><br/>
   Message: <br/>
   ${comment.text} 
  <br/>
  <br/>
------------------------------------------------------------------------
  <br/>
  <br/>
  <a href="${challengeUrl}?unsubscribe=${comment.parentCommentId}">Click here to unsubscribe from the thread.</a> 
  <br/>
  <br/>
  Practice.dev
                  `.trim(),
                },
              },
            },
          })
          .promise();
      })
    );
  });

export const onNewDiscussionEvent = createEventBinding({
  type: 'NewDiscussionEvent',
  handler(event) {
    return onNewDiscussion(event.payload.commentId);
  },
});
