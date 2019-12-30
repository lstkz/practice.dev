import { dynamodb, TABLE_NAME } from '../lib';
import { AppError, UnreachableCaseError } from './errors';
import { Converter } from 'aws-sdk/clients/dynamodb';
import { DbKey } from '../types';

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

export async function getItem<T>(key: {
  pk: string;
  sk: string;
}): Promise<T | undefined> {
  const { Item: item } = await dynamodb
    .getItem({
      TableName: TABLE_NAME,
      Key: Converter.marshall(key),
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

  const mappedKeys = keys.map(key => `${key} = :${key}`);

  return {
    Key: {
      pk: { S: item.pk },
      sk: { S: item.sk },
    },
    UpdateExpression: `SET ${mappedKeys.join(', ')}`,
    ExpressionAttributeValues: Converter.marshall(values),
  };
}

interface TransactWriteItems {
  deleteItems?: Array<{ pk: string; sk: string }>;
  updateItems?: Array<Omit<AWS.DynamoDB.Update, 'TableName'>>;
  putItems?: Array<{ pk: string; sk: string }>;
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

  await dynamodb
    .transactWriteItems(
      {
        TransactItems: [...deleteItems, ...updateItems, ...putItems],
      },
      undefined
    )
    .promise();
}
