import dotenv from 'dotenv';
import { initialize } from 'contract';
import AWS from 'aws-sdk';
import { AppEvent, AppContext } from './types';

dotenv.config({
  path: '../../.env',
});

if (!process.env.TABLE) {
  throw new Error('TABLE is not set');
}

if (!process.env.TOPIC_ARN) {
  throw new Error('TOPIC_ARN is not set');
}

if (!process.env.TESTER_TOPIC_ARN) {
  throw new Error('TESTER_TOPIC_ARN is not set');
}

if (!process.env.GITHUB_CLIENT_ID) {
  throw new Error('GITHUB_CLIENT_ID is not set');
}

if (!process.env.GITHUB_CLIENT_SECRET) {
  throw new Error('GITHUB_CLIENT_SECRET is not set');
}

export const TABLE_NAME = process.env.TABLE;
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
export const TESTER_TOPIC_ARN = process.env.TESTER_TOPIC_ARN;

export const sns = new AWS.SNS({});
export const dynamodb = new AWS.DynamoDB({
  endpoint: process.env.MOCK_DB ? 'http://localhost:4569' : undefined,
});

export const ses = new AWS.SES({
  region: 'eu-west-1',
});

export const EMAIL_SENDER = 'Practice.dev <no-reply@practice.dev>';

export const BASE_URL = process.env.BASE_URL || 'https://practice.dev';

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
