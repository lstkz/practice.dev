import { AWSError, DynamoDB } from 'aws-sdk';
import { AppError } from '../../common/errors';
import { dynamodb, createContract } from '../../lib';
import { S } from 'schema';
import * as db from '../../common/db-next';
import { Converter } from 'aws-sdk/clients/dynamodb';
import { TABLE_NAME } from '../../config';
import { RateLimitEntity } from '../../entities';

async function updateWithConditionCheck(params: DynamoDB.PutItemInput) {
  try {
    await dynamodb.putItem(params).promise();
  } catch (e) {
    const err: AWSError = e;
    if (err.code === 'ConditionalCheckFailedException') {
      throw new AppError(
        'Rate limiter error. Parallel requests are not supported.'
      );
    }
    throw err;
  }
}

async function updateWithIncVersion(item: RateLimitEntity) {
  const version = item.version;
  item.version++;
  await updateWithConditionCheck({
    TableName: TABLE_NAME,
    Item: item.serialize(),
    ExpressionAttributeValues: Converter.marshall({
      ':version': version,
    }),
    ConditionExpression: `version = :version`,
  });
}

export const rateLimit = createContract('misc.rateLimit')
  .params('name', 'duration', 'max')
  .schema({
    name: S.string(),
    duration: S.number(),
    max: S.number(),
  })
  .fn(async (name, duration, max) => {
    let item = await db.getOrNull(RateLimitEntity, { name });

    if (!item) {
      item = new RateLimitEntity({
        name,
        expireAt: Date.now() + duration,
        count: 1,
        version: 1,
      });
      await updateWithConditionCheck({
        TableName: TABLE_NAME,
        Item: item.serialize(),
        ConditionExpression: `attribute_not_exists(pk)`,
      });
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
