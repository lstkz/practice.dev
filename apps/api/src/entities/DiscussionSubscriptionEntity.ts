import { createBaseEntity } from '../lib';

export interface DiscussionSubscriptionKey {
  commentId: string;
  userId: string;
}

export interface DiscussionSubscriptionProps
  extends DiscussionSubscriptionKey {}

const BaseEntity = createBaseEntity('DiscussionSubscription')
  .props<DiscussionSubscriptionProps>()
  .key<DiscussionSubscriptionKey>(key => ({
    pk: `DISCUSSION_SUBSCRIPTION:${key.commentId}`,
    sk: `DISCUSSION_SUBSCRIPTION:${key.userId}`,
  }))
  .build();

export class DiscussionSubscriptionEntity extends BaseEntity {
  static getAllCommentSubscription(commentId: string) {
    return this.queryAll({
      key: {
        pk: this.createKey({ commentId, userId: '-1' }).pk,
      },
    });
  }
}
