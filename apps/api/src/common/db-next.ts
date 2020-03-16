import { dynamodb } from '../lib';
import {
  Converter,
  TransactWriteItemList,
  Update,
} from 'aws-sdk/clients/dynamodb';
import { TABLE_NAME } from '../config';
import { AppError } from './errors';
import { BaseEntity, EntityWithKey } from './orm';
import { DbKey } from '../types';

export async function put(items: BaseEntity[] | BaseEntity) {
  if (Array.isArray(items)) {
    if (!items.length) {
      throw new Error('Items cannot be empty');
    }
    await dynamodb
      .transactWriteItems(
        {
          TransactItems: items.map(item => ({
            Put: {
              TableName: TABLE_NAME,
              Item: item.serialize(),
            },
          })),
        },
        undefined
      )
      .promise();
  } else {
    await dynamodb
      .putItem({
        Item: items.serialize(),
        TableName: TABLE_NAME,
      })
      .promise();
  }
}
export async function update(items: Update[] | Update) {
  if (Array.isArray(items)) {
    if (!items.length) {
      throw new Error('Items cannot be empty');
    }
    await dynamodb
      .transactWriteItems(
        {
          TransactItems: items.map(item => ({
            Update: item,
          })),
        },
        undefined
      )
      .promise();
  } else {
    await dynamodb.updateItem(items).promise();
  }
}

export async function ensureNotExists(values: DbKey, errorMsg: string) {
  const { Item: item } = await dynamodb
    .getItem({
      TableName: TABLE_NAME,
      Key: Converter.marshall(values),
    })
    .promise();
  if (item) {
    throw new AppError(errorMsg);
  }
}
export async function transactWriteItems(items: TransactWriteItemList) {
  if (process.env.MOCK_DB && items.length > 10) {
    await Promise.all([
      dynamodb
        .transactWriteItems({
          TransactItems: items.slice(0, 10),
        })
        .promise(),
      dynamodb
        .transactWriteItems({
          TransactItems: items.slice(10),
        })
        .promise(),
    ]);
  } else {
    await dynamodb
      .transactWriteItems({
        TransactItems: items,
      })
      .promise();
  }
}

interface GetItemOptions {
  consistentRead?: boolean;
}

export async function getItem(
  key: DbKey,
  options: GetItemOptions = {}
): Promise<any | undefined> {
  const { Item: item } = await dynamodb
    .getItem({
      TableName: TABLE_NAME,
      Key: Converter.marshall(key),
      ConsistentRead: options.consistentRead,
    })
    .promise();
  return item ? (Converter.unmarshall(item) as any) : undefined;
}

export async function getOrNull<T extends EntityWithKey<TKey>, TKey>(
  EntityClass: T,
  key: TKey,
  options: GetItemOptions = {}
): Promise<InstanceType<T> | null> {
  const { Item: item } = await dynamodb
    .getItem({
      TableName: TABLE_NAME,
      Key: Converter.marshall(EntityClass.createKey(key)),
      ConsistentRead: options.consistentRead,
    })
    .promise();
  if (!item) {
    return null;
  }
  item ? (Converter.unmarshall(item) as any) : undefined;
  const values = await getItem(EntityClass.createKey(key));
  return values ? new EntityClass(values) : null;
}

export async function get<T extends EntityWithKey<TKey>, TKey>(
  EntityClass: T,
  key: TKey,
  options: GetItemOptions = {}
): Promise<InstanceType<T>> {
  const item = await getOrNull(EntityClass, key, options);
  if (!item) {
    const dbKey = EntityClass.createKey(key);
    throw new Error(
      `Expected object to exists pk = ${dbKey.pk}, sk = ${dbKey.sk}`
    );
  }
  return item;
}
