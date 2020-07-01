import crypto from 'crypto';
import { Handler, ErrorRequestHandler } from 'express';
import { HttpError, BadRequestError } from './errors';
import { ValidationError } from 'veni';
import { ContractError } from 'defensive';

const SECURITY = {
  SALT_LENGTH: 64,
  ITERATIONS: 4096,
  PASSWORD_LENGTH: 64,
};

export const INTERNAL_SERVER_ERROR = 500;
export const BAD_REQUEST = 400;
export const NOT_FOUND = 404;

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

function wrapRoute(fn: Handler): Handler {
  return (req, res, next) => {
    try {
      const result = fn(req, res, next) as any;
      if (result && result.catch) {
        result.catch(next);
      }
    } catch (e) {
      next(e);
    }
  };
}

export function wrapExpress(obj: Handler | Handler[]) {
  if (Array.isArray(obj)) {
    return obj.map(wrapRoute);
  }
  return wrapRoute(obj);
}

export const errorHandlerMiddleware: ErrorRequestHandler = (
  targetError: Error,
  req,
  res,
  next
) => {
  const err = (targetError instanceof ContractError
    ? targetError.original
    : targetError) as Error | ValidationError | HttpError;
  let status = 'statusCode' in err ? err.statusCode : INTERNAL_SERVER_ERROR;
  const isValidationError =
    err instanceof ValidationError ||
    err.message.startsWith('Validation error');
  if (isValidationError) {
    status = BAD_REQUEST;
  }
  if (status < BAD_REQUEST) {
    status = BAD_REQUEST;
  }
  const body: any = { status };

  if (isValidationError) {
    body.error = err.message;
    body.errors = (err as ValidationError).errors;
  } else {
    body.error = err.message;
  }
  if (err instanceof BadRequestError && err.params) {
    body.errorParams = err.params;
  }
  if (process.env.NODE_ENV !== 'production') {
    body.stack = err.stack!.split('\n');
  }
  console.error(err, `${body.status} ${req.method} ${req.url}`);
  res.status(status);
  res.json(body);
};

export const notFoundHandlerMiddleware: Handler = (req, res) => {
  console.error(`404 ${req.method} ${req.url}`);
  res.status(NOT_FOUND);
  res.json({
    status: NOT_FOUND,
    error: 'route not found',
  });
};

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
