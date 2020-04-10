import { AWSError } from 'aws-sdk';
import { AppError } from '../../common/errors';
import { createContract } from '../../lib';
import { S } from 'schema';
import { RateLimitEntity } from '../../entities';

function checkTransactionError(e: AWSError) {
  if (e.code === 'ConditionalCheckFailedException') {
    throw new AppError(
      'Rate limiter error. Parallel requests are not supported.'
    );
  }
  throw e;
}

async function updateWithIncVersion(item: RateLimitEntity) {
  const version = item.version;
  item.version++;
  await item
    .insert({
      conditionExpression: `version = :version`,
      expressionValues: {
        ':version': version,
      },
    })
    .catch(checkTransactionError);
}

export const rateLimit = createContract('misc.rateLimit')
  .params('name', 'duration', 'max')
  .schema({
    name: S.string(),
    duration: S.number(),
    max: S.number(),
  })
  .fn(async (name, duration, max) => {
    let item = await RateLimitEntity.getByKeyOrNull({
      name,
    });

    if (!item) {
      item = new RateLimitEntity({
        name,
        expireAt: Date.now() + duration,
        count: 1,
        version: 1,
      });
      await item
        .insert({
          conditionExpression: `attribute_not_exists(pk)`,
        })
        .catch(checkTransactionError);

      return;
    }

    if (item.expireAt < Date.now()) {
      item.count = 1;
      item.expireAt = Date.now() + duration;
      await updateWithIncVersion(item);
      return;
    }

    if (item.count >= max) {
      throw new AppError(
        `Rate limit exceeded. Limit is ${max} requests per ${duration}ms.`
      );
    }

    item.count++;
    await updateWithIncVersion(item);
  });
