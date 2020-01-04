import * as R from 'remeda';
import { dynamodb, TABLE_NAME } from '../lib';
import { AppError, UnreachableCaseError } from './errors';
import { Converter } from 'aws-sdk/clients/dynamodb';
import { DbKey } from '../types';
import DynamoDB = require('aws-sdk/clients/dynamodb');
import { decLastKey, encLastKey } from './helper';

type CreateKeyOptions =
  | {
      type: 'TOKEN';
      token: string;
    }
  | {
      type: 'CONFIRM_CODE';
      code: string;
    }
  | {
      type: 'USER_EMAIL';
      email: string;
    }
  | {
      type: 'USER_USERNAME';
      username: string;
    }
  | {
      type: 'USER';
      userId: string;
    }
  | {
      type: 'GITHUB_USER';
      id: number;
    }
  | {
      type: 'RESET_PASSWORD_CODE';
      code: string;
    }
  | {
      type: 'CHALLENGE';
      id: number;
    }
  | {
      type: 'CHALLENGE_SOLVED';
      challengeId: number;
      userId: string;
    }
  | {
      type: 'SOLUTION';
      challengeId: number;
      solutionId: string;
      slug: string;
    }
  | {
      type: 'SOLUTION_USER';
      challengeId: number;
      solutionId: string;
      userId: string;
    }
  | {
      type: 'SOLUTION_TAG';
      challengeId: number;
      solutionId: string;
      tag: string;
    }
  | {
      type: 'SEQUENCE';
      key: string;
    }
  | {
      type: 'RATE_LIMIT';
      key: string;
    }
  | {
      type: 'SOCKET_CONNECTION';
      connectionId: string;
      userId: string;
    }
  | {
      type: 'SUBMISSION';
      submissionId: string;
    }
  | {
      type: 'SUBMISSION_USER';
      userId: string;
      submissionId: string;
    }
  | {
      type: 'SUBMISSION_CHALLENGE';
      challengeId: number;
      submissionId: string;
    };

export function createKey(
  options: CreateKeyOptions
): { pk: string; sk: string } {
  switch (options.type) {
    case 'TOKEN': {
      const pk = `TOKEN:${options.token}`;
      return {
        pk,
        sk: pk,
      };
    }
    case 'CONFIRM_CODE': {
      const pk = `CONFIRM_CODE:${options.code}`;
      return {
        pk,
        sk: pk,
      };
    }
    case 'USER_EMAIL': {
      const pk = `USER_EMAIL:${options.email.toLowerCase()}`;
      return {
        pk,
        sk: pk,
      };
    }
    case 'USER_USERNAME': {
      const pk = `USER_USERNAME:${options.username.toLowerCase()}`;
      return {
        pk,
        sk: pk,
      };
    }
    case 'USER': {
      const pk = `USER:${options.userId}`;
      return {
        pk,
        sk: pk,
      };
    }
    case 'GITHUB_USER': {
      const pk = `GITHUB_USER:${options.id}`;
      return {
        pk,
        sk: pk,
      };
    }
    case 'RESET_PASSWORD_CODE': {
      const pk = `RESET_PASSWORD_CODE:${options.code}`;
      return {
        pk,
        sk: pk,
      };
    }
    case 'CHALLENGE': {
      return {
        pk: `CHALLENGE:${options.id}`,
        sk: 'CHALLENGE',
      };
    }
    case 'CHALLENGE_SOLVED': {
      return {
        pk: `CHALLENGE_SOLVED:${options.userId}`,
        sk: `CHALLENGE_SOLVED:${options.challengeId}`,
      };
    }
    case 'SOLUTION': {
      return {
        pk: `SOLUTION:${options.challengeId}:${options.slug}`,
        sk: `SOLUTION:${options.challengeId}`,
      };
    }
    case 'SOLUTION_USER': {
      return {
        pk: `SOLUTION_USER:${options.solutionId}`,
        sk: `SOLUTION_USER:${options.userId}`,
      };
    }
    case 'SOLUTION_TAG': {
      return {
        pk: `SOLUTION_TAG:${options.solutionId}`,
        sk: `SOLUTION_TAG:${options.challengeId}:${options.tag}`,
      };
    }
    case 'SEQUENCE': {
      const pk = `SEQUENCE:${options.key}`;
      return {
        pk,
        sk: pk,
      };
    }
    case 'RATE_LIMIT': {
      const pk = `RATE_LIMIT:${options.key}`;
      return {
        pk,
        sk: pk,
      };
    }
    case 'SOCKET_CONNECTION': {
      return {
        pk: `SOCKET_CONNECTION:${options.connectionId}`,
        sk: `SOCKET_CONNECTION:${options.userId}`,
      };
    }
    case 'SUBMISSION': {
      const pk = `SUBMISSION:${options.submissionId}`;
      return {
        pk,
        sk: pk,
      };
    }
    case 'SUBMISSION_USER': {
      return {
        pk: `SUBMISSION_USER:${options.submissionId}`,
        sk: `SUBMISSION_USER:${options.userId}`,
      };
    }
    case 'SUBMISSION_CHALLENGE': {
      return {
        pk: `SUBMISSION_CHALLENGE:${options.submissionId}`,
        sk: `SUBMISSION_CHALLENGE:${options.challengeId}`,
      };
    }
    default:
      throw new UnreachableCaseError(options);
  }
}

export async function putItems(items: any[] | any) {
  if (Array.isArray(items)) {
    if (!items.length) {
      throw new Error('Items cannot be empty');
    }
    await dynamodb
      .transactWriteItems(
        {
          TransactItems: items.map(item => ({
            Put: { TableName: TABLE_NAME, Item: Converter.marshall(item) },
          })),
        },
        undefined
      )
      .promise();
  } else {
    await dynamodb
      .putItem({
        Item: Converter.marshall(items),
        TableName: TABLE_NAME,
      })
      .promise();
  }
}

interface GetItemOptions {
  consistentRead?: boolean;
}

export async function getItem<T>(
  key: {
    pk: string;
    sk: string;
  },
  options: GetItemOptions = {}
): Promise<T | undefined> {
  const { Item: item } = await dynamodb
    .getItem({
      TableName: TABLE_NAME,
      Key: Converter.marshall(key),
      ConsistentRead: options.consistentRead,
    })
    .promise();
  return item ? (Converter.unmarshall(item) as any) : undefined;
}

export async function getItemEnsure<T>(key: {
  pk: string;
  sk: string;
}): Promise<T> {
  const item = await getItem<T>(key);
  if (!item) {
    throw new Error(`Expected object to exists pk = ${key.pk}, sk = ${key.sk}`);
  }
  return item;
}

export async function ensureNotExists(values: any, errorMsg: string) {
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

export function prepareUpdate<T extends DbKey>(item: T, keys: Array<keyof T>) {
  const values = keys.reduce((ret, key) => {
    ret[`:${key}`] = item[key];
    return ret;
  }, {} as { [x: string]: any });
  const names = keys.reduce((ret, key) => {
    ret[`#${key}`] = key;
    return ret;
  }, {} as { [x: string]: any });

  const mappedKeys = keys.map(key => `#${key} = :${key}`);

  return {
    Key: {
      pk: { S: item.pk },
      sk: { S: item.sk },
    },
    UpdateExpression: `SET ${mappedKeys.join(', ')}`,
    ExpressionAttributeValues: Converter.marshall(values),
    ExpressionAttributeNames: names,
  };
}

export async function updateItem<T extends DbKey>(
  item: T,
  keys: Array<keyof T>
) {
  const update = prepareUpdate(item, keys);
  await dynamodb
    .updateItem({
      TableName: TABLE_NAME,
      ...update,
    })
    .promise();
}

interface TransactWriteItems {
  deleteItems?: Array<{ pk: string; sk: string }>;
  updateItems?: Array<Omit<AWS.DynamoDB.Update, 'TableName'>>;
  putItems?: Array<{ pk: string; sk: string }>;
  conditionalPutItems?: Array<{
    expression: string;
    item: { pk: string; sk: string };
  }>;
}

export async function transactWriteItems(options: TransactWriteItems) {
  const deleteItems = (options.deleteItems || []).map(item => ({
    Delete: {
      TableName: TABLE_NAME,
      Key: Converter.marshall(item),
    },
  }));

  const updateItems = (options.updateItems || []).map(item => ({
    Update: {
      TableName: TABLE_NAME,
      ...item,
    },
  }));

  const putItems = (options.putItems || []).map(item => ({
    Put: {
      TableName: TABLE_NAME,
      Item: Converter.marshall(item),
    },
  }));

  const conditionalPutItemsPutItems = (options.conditionalPutItems || []).map(
    item => ({
      Put: {
        TableName: TABLE_NAME,
        ConditionExpression: item.expression,
        Item: Converter.marshall(item.item),
      },
    })
  );

  await dynamodb
    .transactWriteItems(
      {
        TransactItems: [
          ...deleteItems,
          ...updateItems,
          ...putItems,
          ...conditionalPutItemsPutItems,
        ],
      },
      undefined
    )
    .promise();
}

export async function batchRawWriteItemWithRetry(
  requestItems: DynamoDB.BatchWriteItemRequestMap,
  retry = 20
) {
  if (!retry) {
    console.error('requestItems', requestItems);
    throw new Error('Cannot process batchWriteItemWithRetry. Retry = 0.');
  }
  const result = await dynamodb
    .batchWriteItem({
      RequestItems: requestItems,
    })
    .promise();

  if (result.UnprocessedItems && Object.keys(result.UnprocessedItems).length) {
    await batchRawWriteItemWithRetry(result.UnprocessedItems);
  }
}

export async function batchDelete<T extends DbKey>(items: T[]) {
  if (!items.length) {
    return;
  }
  await batchRawWriteItemWithRetry({
    [TABLE_NAME]: items.map(item => ({
      DeleteRequest: {
        Key: Converter.marshall(R.pick(item, ['sk', 'pk'])),
      },
    })),
  });
}

interface BaseQueryOptions {
  cursor?: string | null;
  descending?: boolean;
  limit?: number;
}

interface QueryIndexOptions extends BaseQueryOptions {
  index: 'sk-data_n-index' | 'sk-data2_n-index';
  sk: string;
}

export async function queryIndex<T>(options: QueryIndexOptions) {
  const { index, sk, ...base } = options;
  return _query<T>(
    index,
    'sk = :sk',
    {
      ':sk': {
        S: sk,
      },
    },
    base
  );
}

interface QueryMainIndexOptions {
  pk: string;
}

export async function queryMainIndex<T>(options: QueryMainIndexOptions) {
  const { pk, ...base } = options;
  return _query<T>(
    undefined,
    'pk = :pk',
    {
      ':pk': {
        S: pk,
      },
    },
    base
  );
}

async function _query<T>(
  index: string | undefined,
  keyConditionExpression: string,
  expressionValues: DynamoDB.ExpressionAttributeValueMap,
  options: BaseQueryOptions
) {
  const result = await dynamodb
    .query(
      {
        TableName: TABLE_NAME,
        IndexName: index,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionValues,
        Limit: options.limit,
        ExclusiveStartKey: options.cursor
          ? decLastKey(options.cursor)
          : undefined,
        ScanIndexForward: !options.descending,
      },
      undefined
    )
    .promise();
  return {
    items: (result.Items || []).map(item => Converter.unmarshall(item) as T),
    cursor: encLastKey(result.LastEvaluatedKey),
  };
}
