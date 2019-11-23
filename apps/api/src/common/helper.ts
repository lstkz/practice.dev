import crypto from 'crypto';

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
