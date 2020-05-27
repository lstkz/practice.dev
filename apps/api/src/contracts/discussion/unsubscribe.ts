import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { DiscussionSubscriptionEntity } from '../../entities';

export const unsubscribe = createContract('discussion.unsubscribe')
  .params('userId', 'commentId')
  .schema({
    userId: S.string(),
    commentId: S.string(),
  })
  .fn(async (userId, commentId) => {
    const subscription = await DiscussionSubscriptionEntity.getByKeyOrNull({
      commentId,
      userId,
    });
    if (!subscription) {
      return;
    }
    await subscription.delete();
  });

export const unsubscribeRpc = createRpcBinding({
  injectUser: true,
  signature: 'discussion.unsubscribe',
  handler: unsubscribe,
});
