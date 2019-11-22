import dotenv from 'dotenv';
import { initialize } from 'contract';
import AWS from 'aws-sdk';
import { AppEvent } from './types';

dotenv.config({
  path: '../../.env',
});

if (!process.env.TABLE) {
  throw new Error('TABLE is not set');
}

if (!process.env.TOPIC_ARN) {
  throw new Error('TOPIC_ARN is not set');
}

export const TABLE_NAME = process.env.TABLE;

export const sns = new AWS.SNS({});
export const dynamodb = new AWS.DynamoDB({
  endpoint: process.env.MOCK_DB ? 'http://localhost:4569' : undefined,
});

export interface CreateRpcBindingOptions {
  public?: true;
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
