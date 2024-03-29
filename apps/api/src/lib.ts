import { TABLE_NAME } from './config';
import { initialize } from 'contract';
import AWS from 'aws-sdk';
import { AppEvent, EntityType } from './types';
import { Transaction } from './orm/Transaction';
import { createBaseEntityProvider } from './orm/createBaseEntityProvider';

export const sns = new AWS.SNS({});
export const s3 = new AWS.S3({});
export const dynamodb = new AWS.DynamoDB({
  endpoint: process.env.MOCK_DB ? 'http://localhost:8000' : undefined,
});

export const dynamoStream = new AWS.DynamoDBStreams({
  endpoint: process.env.MOCK_DB ? 'http://localhost:8000' : undefined,
});

export const ses = new AWS.SES({
  region: process.env.SES_REGION,
});

export const createTransaction = () => new Transaction(dynamodb);

export const createBaseEntity = createBaseEntityProvider({
  dynamodb,
  tableName: TABLE_NAME,
  indexes: {
    data: 'string',
    data_n: 'number',
  },
});

export interface CreateRpcBindingOptions {
  verified?: true;
  injectUser?: boolean;
  public?: true;
  admin?: true;
  signature: string;
  handler: (...args: any[]) => any;
}

export function createRpcBinding(options: CreateRpcBindingOptions) {
  return {
    isBinding: true,
    type: 'rpc',
    options,
  };
}

export type CreateDynamoStreamBindingOptions<T> = {
  type: EntityType;
  insert?(eventId: string, item: T): any;
  modify?(eventId: string, newItem: T, oldItem: T): any;
  remove?(eventId: string, item: T): any;
};

export function createDynamoStreamBinding<T>(
  options: CreateDynamoStreamBindingOptions<T>
) {
  return {
    isBinding: true,
    type: 'dynamoStream',
    options,
  };
}

export const { createContract } = initialize({
  debug: process.env.NODE_ENV === 'development',
});

type MapEvents<T> = T extends { type: string }
  ? { type: T['type']; handler: (event: T) => Promise<any> }
  : never;
export type CreateEventBindingOptions = MapEvents<AppEvent>;

export function createEventBinding(options: CreateEventBindingOptions) {
  return {
    isBinding: true,
    type: 'event',
    options,
  };
}
