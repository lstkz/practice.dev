import { Request, Response } from 'express';
import { initialize } from 'defensive';
import { ContractBinding } from 'defensive';

ContractBinding.prototype.express = function (options) {
  if (!this.fn.expressOptions) {
    this.fn.expressOptions = [];
  }
  this.fn.expressOptions.push(options);
  return this.fn as any;
};

type ExpressOptions = {
  public?: boolean;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  path: string;
} & (
  | {
      json?: never;
      handler(req: Request, res: Response): void;
    }
  | { handler?: never; json(req: Request, res: Response): object }
);

declare module 'defensive' {
  interface ContractBinding<T> {
    expressOptions?: ExpressOptions[];
    express(options: ExpressOptions): T & ContractBinding<T>;
  }
}

export const { createContract } = initialize();
