import { dynamodb } from '../lib';
import { Converter, TransactWriteItemList } from 'aws-sdk/clients/dynamodb';
import { TABLE_NAME } from '../config';
import { AppError } from './errors';
import { BaseEntity, EntityWithKey } from './orm';

// export async function getByKeyOrNull<T extends EntityWithKey>(
//   key: any,
//   EntityClass: T
// ): Promise<InstanceType<T>> {
//   const values = await getItem(EntityClass.createKey(key));
//   return values ? new EntityClass(values) : null;
// }

// export async function getByKey<T extends EntityWithKey>(
//   key: any,
//   EntityClass: T
// ): Promise<InstanceType<T>> {
//   const item = await getByKeyOrNull(key, EntityClass);
//   if (!item) {
//     const dbKey = EntityClass.createKey(key);
//     throw new Error(
//       `Expected object to exists pk = ${dbKey.pk}, sk = ${dbKey.sk}`
//     );
//   }
//   return item;
// }

// export function prepareUpdate(
//   item: BaseEntity,
//   keys: string[],
//   tableName: string
// ) {
//   const values = keys.reduce((ret, key) => {
//     const value = (item as any)[key];
//     ret[`:${key}`] = value === undefined ? null : value;
//     return ret;
//   }, {} as { [x: string]: any });
//   const names = keys.reduce((ret, key) => {
//     ret[`#${key}`] = key;
//     return ret;
//   }, {} as { [x: string]: any });

//   const mappedKeys = keys.map(key => `#${key} = :${key}`);

//   return {
//     Key: Converter.marshall(item.key),
//     UpdateExpression: `SET ${mappedKeys.join(', ')}`,
//     TableName: tableName,
//     ExpressionAttributeValues: Converter.marshall(values),
//     ExpressionAttributeNames: names,
//   };
// }

export async function putItems(items: BaseEntity[] | BaseEntity) {
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

export async function ensureNotExists(
  values: { pk: string; sk: string },
  errorMsg: string
) {
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
interface GetItemOptions {
  consistentRead?: boolean;
}

export async function getItem(
  key: {
    pk: string;
    sk: string;
  },
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

// export interface TransactWriteItems {
//   // deleteItems: Array<DbKey>;
//   // updateItems: Array<Omit<AWS.DynamoDB.Update, 'TableName'>>;
//   // putItems: Array<BaseEntity>;
//   // conditionalPutItems: Array<{
//   //   expression: string;
//   //   values?: { [x: string]: any };
//   //   item: DbKey;
//   // }>;
//   // conditionalDeleteItems: Array<{
//   //   expression: string;
//   //   key: DbKey;
//   // }>;

//   put: Dynamo;
// }

export async function transactWriteItems(items: TransactWriteItemList) {
  // const deleteItems = (options.deleteItems || []).map(item => ({
  //   Delete: {
  //     TableName: TABLE_NAME,
  //     Key: Converter.marshall(item),
  //   },
  // }));

  // const updateItems = (options.updateItems || []).map(item => ({
  //   Update: {
  //     TableName: TABLE_NAME,
  //     ...item,
  //   },
  // }));

  // const putItems = (options.putItems || []).map(item => ({
  //   Put: {
  //     TableName: TABLE_NAME,
  //     Item: Converter.marshall(item),
  //   },
  // }));

  // const conditionalPutItems = (options.conditionalPutItems || []).map(item => ({
  //   Put: {
  //     TableName: TABLE_NAME,
  //     ConditionExpression: item.expression,
  //     ExpressionAttributeValues: item.values && Converter.marshall(item.values),
  //     Item: Converter.marshall(item.item),
  //   },
  // }));

  // const conditionalDeleteItems = (options.conditionalDeleteItems || []).map(
  //   item => ({
  //     Delete: {
  //       TableName: TABLE_NAME,
  //       ConditionExpression: item.expression,
  //       Key: Converter.marshall(item.key),
  //     },
  //   })
  // );

  // const writeItems = [
  //   ...updateItems,
  //   ...deleteItems,
  //   ...putItems,
  //   ...conditionalPutItems,
  //   ...conditionalDeleteItems,
  // ];
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

export async function getOrNull<T extends EntityWithKey<TKey>, TKey>(
  EntityClass: T,
  key: TKey
): Promise<InstanceType<T> | null> {
  const values = await getItem(EntityClass.createKey(key));
  return values ? new EntityClass(values) : null;
}

export async function get<T extends EntityWithKey<TKey>, TKey>(
  EntityClass: T,
  key: TKey
): Promise<InstanceType<T>> {
  const item = await getOrNull(EntityClass, key);
  if (!item) {
    const dbKey = EntityClass.createKey(key);
    throw new Error(
      `Expected object to exists pk = ${dbKey.pk}, sk = ${dbKey.sk}`
    );
  }
  return item;
}
