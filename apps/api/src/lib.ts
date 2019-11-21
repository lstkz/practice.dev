import dotenv from 'dotenv';
import { initialize } from 'contract';
import AWS from 'aws-sdk';

dotenv.config({
  path: '../../.env',
});

if (!process.env.TABLE) {
  throw new Error('TABLE is not set');
}

export const TABLE_NAME = process.env.TABLE;

export const dynamodb = new AWS.DynamoDB();

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

// import { ContractBinding } from 'contract';
// import { AppEvent } from '../types';

// export function addEventBinding() {
//   ContractBinding.prototype.event = function(options) {
//     this.fn.eventOptions = options;
//     return this.fn as any;
//   };
// }

// type MapEvents<T> = T extends { type: string }
//   ? { type: T['type']; handler: (event: T) => Promise<any> }
//   : never;

// type EventOptions = MapEvents<AppEvent>;

// declare module 'defensive' {
//   interface ContractBinding<T> {
//     eventOptions?: EventOptions;
//     event(options: EventOptions): T & ContractBinding<T>;
//   }
// }
