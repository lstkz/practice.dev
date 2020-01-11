import './config';
import { initialize } from 'contract';
import AWS from 'aws-sdk';
import { AppEvent, AppContext } from './types';

export const sns = new AWS.SNS({});
export const s3 = new AWS.S3({});
export const dynamodb = new AWS.DynamoDB({
  endpoint: process.env.MOCK_DB ? 'http://localhost:4569' : undefined,
});

export const ses = new AWS.SES({
  region: 'eu-west-1',
});

export interface CreateRpcBindingOptions {
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

export const { createContract, runWithContext, getContext } = initialize<
  AppContext
>({
  debug: process.env.NODE_ENV === 'development',
});

export const getLoggedInUser = () => {
  const { user } = getContext();
  if (!user) {
    throw new Error('Expected user to be logged in.');
  }
  return user;
};

export const getLoggedInUserOrAnonymous = () => {
  const { user } = getContext();
  return user;
};

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
