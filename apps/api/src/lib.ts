import './config';
import { initialize } from 'contract';
import AWS from 'aws-sdk';
import { AppEvent, EntityType, StreamAction } from './types';

export const sns = new AWS.SNS({});
export const s3 = new AWS.S3({});
export const dynamodb = new AWS.DynamoDB({
  endpoint: process.env.MOCK_DB ? 'http://localhost:8000' : undefined,
});

export const dynamoStream = new AWS.DynamoDBStreams({
  endpoint: process.env.MOCK_DB ? 'http://localhost:8000' : undefined,
});

export const ses = new AWS.SES({
  region: 'eu-west-1',
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
