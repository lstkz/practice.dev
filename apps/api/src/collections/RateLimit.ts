import { createCollection } from '../db';

export interface RateLimitModel {
  _id: string;
  count: number;
  expireAt: Date;
}

export const RateLimitCollection = createCollection<RateLimitModel>(
  'rateLimit',
  [
    {
      key: {
        expireAt: 1,
      },
      expireAfterSeconds: 0,
    },
  ]
);
