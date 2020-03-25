import { PropsOnly } from '../types';
import { BaseEntity } from '../common/orm';

export type RateLimitProps = PropsOnly<RateLimitEntity>;

export type RateLimitKey = {
  name: string;
};

/**
 * Represents a rate limiter.
 */
export class RateLimitEntity extends BaseEntity {
  name!: string;
  count!: number;
  expireAt!: number;
  version!: number;

  constructor(values: RateLimitProps) {
    super(values);
  }

  get key() {
    return RateLimitEntity.createKey(this);
  }

  static createKey({ name }: RateLimitKey) {
    const pk = `RATE_LIMIT:${name}`;
    return {
      pk,
      sk: pk,
    };
  }
}
