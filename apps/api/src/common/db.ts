import { dynamodb, TABLE_NAME } from '../lib';
import { AppError } from './errors';
import { Converter } from 'aws-sdk/clients/dynamodb';

type UserKeyType =
  | 'USER_EMAIL'
  | 'USER_USERNAME'
  | 'USER'
  | 'TOKEN'
  | 'GITHUB_USER'
  | 'USER_AUTH'
  | 'USER_AUTH_GITHUB'
  | 'CONFIRM_CODE'
  | 'RESET_PASSWORD_CODE';

export function createKey(key: UserKeyType, value: string | number) {
  switch (key) {
    case 'RESET_PASSWORD_CODE':
    case 'CONFIRM_CODE':
      return `${key}:${value}`;
    default:
      return `${key}:${value.toString().toLowerCase()}`;
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
