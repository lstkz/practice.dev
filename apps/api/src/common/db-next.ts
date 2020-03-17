import { dynamodb } from '../lib';
import {
  Converter,
  TransactWriteItemList,
  Update,
  Delete,
  BatchGetRequestMap,
  BatchGetResponseMap,
  QueryOutput,
  QueryInput,
} from 'aws-sdk/clients/dynamodb';
import { TABLE_NAME } from '../config';
import { AppError } from './errors';
import { BaseEntity, EntityWithKey } from './orm';
import { DbKey } from '../types';
import { decLastKey, encLastKey } from './helper';

type DbIndex = 'sk-data_n-index' | 'sk-data2_n-index' | 'sk-data-index';

type EntityConstructor = {
  new (values: any): any;
};

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

export async function remove(items: Delete[] | Delete) {
  if (Array.isArray(items)) {
    if (!items.length) {
      throw new Error('Items cannot be empty');
    }
    await dynamodb
      .transactWriteItems(
        {
          TransactItems: items.map(item => ({
            Delete: item,
          })),
        },
        undefined
      )
      .promise();
  } else {
    await dynamodb.deleteItem(items).promise();
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
  return new EntityClass(Converter.unmarshall(item));
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

export async function batchGetItemWithRetry(
  requestItems: BatchGetRequestMap,
  retry = 20
): Promise<BatchGetResponseMap> {
  if (!retry) {
    console.error('requestItems', requestItems);
    throw new Error('Cannot process batchGetItemWithRetry. Retry = 0.');
  }
  const result = await dynamodb
    .batchGetItem({
      RequestItems: requestItems,
    })
    .promise();

  const ret = result.Responses || {};

  if (result.UnprocessedKeys && Object.keys(result.UnprocessedKeys).length) {
    const extra = await batchGetItemWithRetry(result.UnprocessedKeys);
    Object.keys(extra).forEach(table => {
      if (!ret[table]) {
        ret[table] = [];
      }
      ret[table].push(...extra[table]);
    });
  }
  return ret;
}

export interface BaseSearchCriteria {
  limit?: number;
  descending?: boolean;
  cursor?: string | null;
}

export function getBaseQuery(criteria: BaseSearchCriteria, index?: DbIndex) {
  return {
    TableName: TABLE_NAME,
    IndexName: index,
    Limit: criteria.limit,
    ExclusiveStartKey: criteria.cursor
      ? decLastKey(criteria.cursor)
      : undefined,
    ScanIndexForward: !criteria.descending,
  };
}

export function mapQueryResult<
  T extends {
    new (values: any): any;
  }
>(
  Entity: T,
  result: QueryOutput
): { items: Array<InstanceType<T>>; cursor: string | null } {
  return {
    items: (result.Items || []).map(item => {
      const values = Converter.unmarshall(item);
      return new Entity(values);
    }),
    cursor: encLastKey(result.LastEvaluatedKey),
  };
}

export function getSkQueryParams(sk: string) {
  return {
    KeyConditionExpression: 'sk = :sk',
    ExpressionAttributeValues: Converter.marshall({
      ':sk': sk,
    }),
  };
}

export function getPkQueryParams(pk: string) {
  return {
    KeyConditionExpression: 'pk = :pk',
    ExpressionAttributeValues: Converter.marshall({
      ':pk': pk,
    }),
  };
}

export async function query<T extends EntityConstructor>(
  Entity: T,
  params: QueryInput
) {
  const ret = await dynamodb.query(params).promise();
  return mapQueryResult(Entity, ret);
}

export async function queryAll<T extends EntityConstructor>(
  Entity: T,
  params: QueryInput
) {
  const allItems: Array<InstanceType<T>> = [];
  const fetch = async (cursor: string | null) => {
    const result = await query(Entity, {
      ...params,
      ExclusiveStartKey: cursor ? decLastKey(cursor) : undefined,
    });
    allItems.push(...result.items);
    if (result.cursor) {
      await fetch(result.cursor);
    }
  };
  await fetch(null);
  return allItems;
}
