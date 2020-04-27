import { AppError } from '../../common/errors';
import { createContract } from '../../lib';
import { S } from 'schema';
import { RateLimitCollection } from '../../collections/RateLimit';

export const rateLimit = createContract('misc.rateLimit')
  .params('name', 'duration', 'max')
  .schema({
    name: S.string(),
    duration: S.number(),
    max: S.number(),
  })
  .fn(async (name, duration, max) => {
    const ret = await RateLimitCollection.findOneAndUpdate(
      {
        _id: name,
      },
      {
        $inc: {
          count: 1,
        },
        $setOnInsert: {
          expireAt: new Date(Date.now() + duration),
        },
      },
      {
        upsert: true,
        returnOriginal: false,
      }
    );
    if (!ret.value) {
      throw new Error('Expected value to be defined');
    }
    if (ret.value.count > max) {
      throw new AppError(
        `Rate limit exceeded. Limit is ${max} requests per ${duration}ms.`
      );
    }
  });
