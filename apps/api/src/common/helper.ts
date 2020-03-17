import crypto from 'crypto';
import { Response } from 'node-fetch';
import { DynamoDB } from 'aws-sdk';
import * as R from 'remeda';
import { AppError } from './errors';
import { DbUser } from '../types';

const SECURITY = {
  SALT_LENGTH: 64,
  ITERATIONS: 4096,
  PASSWORD_LENGTH: 64,
};

async function randomBytes(size: number) {
  return new Promise<Buffer>((resolve, reject) => {
    crypto.randomBytes(size, (err, buf) => {
      if (err) {
        reject(err);
      } else {
        resolve(buf);
      }
    });
  });
}

async function pbkdf2(
  password: crypto.BinaryLike,
  salt: crypto.BinaryLike,
  iterations: number,
  keylen: number,
  digest: string
) {
  return new Promise<Buffer>((resolve, reject) => {
    crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, buf) => {
      if (err) {
        reject(err);
      } else {
        resolve(buf);
      }
    });
  });
}

export async function randomSalt() {
  const buffer = await randomBytes(SECURITY.SALT_LENGTH);
  return buffer.toString('hex');
}

export async function createPasswordHash(password: string, salt: string) {
  const hash = await pbkdf2(
    password,
    salt,
    SECURITY.ITERATIONS,
    SECURITY.PASSWORD_LENGTH,
    'sha1'
  );
  return hash.toString('hex');
}

export function randomString(length: number) {
  const chars = 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789';
  const randomBytes = crypto.randomBytes(length);
  const result = new Array(length);
  let cursor = 0;
  for (let i = 0; i < length; i++) {
    cursor += randomBytes[i];
    result[i] = chars[cursor % chars.length];
  }
  return result.join('');
}

export function randomUniqString() {
  return randomString(15);
}

export async function getResponseBody<T = any>(opName: string, res: Response) {
  if (res.status !== 200) {
    const msg = `${opName} failed with code: ${res.status}`;
    console.error(msg, {
      responseText: await res.text(),
    });
    throw new Error(msg);
  }
  const body = await res.json();
  if (body.error) {
    const msg = `${opName} failed with code: ${body.error_description ||
      body.error}`;
    console.error(msg, {
      body,
    });
    throw new Error(msg);
  }
  return body as T;
}

export function getDuration(n: number, type: 's' | 'm' | 'h' | 'd') {
  const seconds = 1000;
  const minutes = seconds * 60;
  const hours = minutes * 60;
  const days = 24 * hours;
  switch (type) {
    case 's': {
      return n * seconds;
    }
    case 'm': {
      return n * minutes;
    }
    case 'h': {
      return n * hours;
    }
    case 'd': {
      return n * days;
    }
  }
}

export function safeAssign<T extends V, V>(target: T, values: V) {
  Object.assign(target, values);
  return target;
}

export function safeKeys<T>(obj: T): Array<keyof T> {
  return Object.keys(obj) as any;
}

function getEncHash(data: string) {
  return crypto
    .createHash('md5')
    .update(data)
    .digest('hex')
    .substr(0, 10);
}

export function encLastKey(key: DynamoDB.Key | undefined) {
  if (!key) {
    return null;
  }
  const data = Buffer.from(JSON.stringify(key)).toString('base64');
  return data + '.' + getEncHash(data);
}

export function decLastKey(key: string | undefined) {
  if (!key) {
    return null;
  }
  const [data, hash] = key.split('.');
  if (!hash) {
    return new AppError('Invalid lastKey');
  }
  const expectedHash = getEncHash(data);
  if (hash !== expectedHash) {
    return new AppError('Invalid lastKey');
  }
  return JSON.parse(Buffer.from(data, 'base64').toString('utf8'));
}

export function normalizeTags(tags: string[]) {
  return R.uniq(tags.map(x => x.toLowerCase().trim()));
}

export function rethrowTransactionCanceled(msg: string) {
  return (e: any) => {
    if (e.code === 'TransactionCanceledException') {
      throw new AppError(msg);
    }

    throw e;
  };
}
export function ignoreTransactionCanceled() {
  return (e: any) => {
    if (e.code === 'TransactionCanceledException') {
      return;
    }

    throw e;
  };
}

export function assertAuthorOrAdmin<T extends { userId: string }>(
  item: T,
  user: DbUser
) {
  if (item.userId !== user.userId && !user.isAdmin) {
    throw new AppError('No Permissions');
  }
}

export function doFn<T>(fn: () => T) {
  return fn();
}
