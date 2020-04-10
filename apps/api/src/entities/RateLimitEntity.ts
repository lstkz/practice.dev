import { createBaseEntity } from '../lib';

export interface RateLimitKey {
  name: string;
}

export interface RateLimitProps extends RateLimitKey {
  count: number;
  expireAt: number;
  version: number;
}

const BaseEntity = createBaseEntity()
  .props<RateLimitProps>()
  .key<RateLimitKey>(key => `RATE_LIMIT:${key.name}`)
  .build();

export class RateLimitEntity extends BaseEntity {}
