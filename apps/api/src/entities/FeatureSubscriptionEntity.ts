import { createBaseEntity } from '../lib';

export interface FeatureSubscriptionKey {
  type: string;
  email: string;
}

export interface FeatureSubscriptionProps extends FeatureSubscriptionKey {
  createdAt: number;
}

const BaseEntity = createBaseEntity('FeatureSubscription')
  .props<FeatureSubscriptionProps>()
  .key<FeatureSubscriptionKey>(key => ({
    pk: `FEATURE_SUBSCRIPTION:${key.type}`,
    sk: `FEATURE_SUBSCRIPTION:${key.email.toLowerCase()}`,
  }))
  .build();

export class FeatureSubscriptionEntity extends BaseEntity {}
