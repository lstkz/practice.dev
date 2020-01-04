import { AWSError, DynamoDB } from 'aws-sdk';
import { AppError } from '../../common/errors';
import { dynamodb, TABLE_NAME, createContract } from '../../lib';
import { S } from 'schema';
import { createKey, getItem } from '../../common/db';
import { Converter } from 'aws-sdk/clients/dynamodb';
import { DbRateLimit } from '../../types';

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

async function updateWithIncVersion(item: DbRateLimit) {
  await updateWithConditionCheck({
    TableName: TABLE_NAME,
    Item: Converter.marshall({
      ...item,
      version: item.version + 1,
    }),
    ExpressionAttributeValues: Converter.marshall({
      ':version': item.version,
    }),
    ConditionExpression: `version = :version`,
  });
}

export const rateLimit = createContract('misc.rateLimit')
  .params('key', 'duration', 'max')
  .schema({
    key: S.string(),
    duration: S.number(),
    max: S.number(),
  })
  .fn(async (key, duration, max) => {
    const dbKey = createKey({
      type: 'RATE_LIMIT',
      key,
    });
    let item = await getItem<DbRateLimit>(dbKey);

    if (!item) {
      item = {
        ...dbKey,
        expireAt: Date.now() + duration,
        count: 1,
        version: 1,
      };
      await updateWithConditionCheck({
        TableName: TABLE_NAME,
        Item: Converter.marshall(item),
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
