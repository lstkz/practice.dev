import crypto from 'mz/crypto';

const SECURITY = {
  SALT_LENGTH: 64,
  ITERATIONS: 4096,
  PASSWORD_LENGTH: 64,
};

export async function randomSalt() {
  const buffer = await crypto.randomBytes(SECURITY.SALT_LENGTH);
  return buffer.toString('hex');
}

export async function createPasswordHash(password: string, salt: string) {
  const hash = await crypto.pbkdf2(
    password,
    salt,
    SECURITY.ITERATIONS,
    SECURITY.PASSWORD_LENGTH,
    'sha1'
  );
  return hash.toString('hex');
}
