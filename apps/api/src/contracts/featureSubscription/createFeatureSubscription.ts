import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { FeatureSubscriptionEntity } from '../../entities';

export const createFeatureSubscription = createContract(
  'featureSubscription.createFeatureSubscription'
)
  .params('type', 'email')
  .schema({
    type: S.enum().literal('contest'),
    email: S.string().email(),
  })
  .fn(async (type, email) => {
    const subscription = new FeatureSubscriptionEntity({
      createdAt: Date.now(),
      email: email,
      type,
    });
    await subscription.insert();
  });

export const confirmEmailRpc = createRpcBinding({
  public: true,
  signature: 'featureSubscription.createFeatureSubscription',
  handler: createFeatureSubscription,
});
