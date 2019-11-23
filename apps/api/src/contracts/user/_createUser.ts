import { randomSalt, createPasswordHash } from '../../common/helper';
import uuid from 'uuid';
import { createKey, ensureNotExists, putItems } from '../../common/db';
import { DbUser, DbUserUsername, DbUserEmail } from '../../types';

interface CreateUserValues {
  userId?: string;
  email: string;
  password: string;
  username: string;
  isVerified: boolean;
  githubId?: number;
}

export async function _createUser(values: CreateUserValues) {
  const userId = values.userId || uuid();
  const userKey = createKey({ type: 'USER', userId: userId });
  const uniqueEmailKey = createKey({ type: 'USER_EMAIL', email: values.email });
  const uniqueUsernameKey = createKey({
    type: 'USER_USERNAME',
    username: values.username,
  });
  const salt = await randomSalt();
  const password = await createPasswordHash(values.password, salt);

  await Promise.all([
    ensureNotExists(uniqueEmailKey, 'Email is already registered'),
    ensureNotExists(uniqueUsernameKey, 'Username is already taken'),
  ]);

  const dbUser: DbUser = {
    ...userKey,
    userId: userId,
    email: values.email,
    username: values.username,
    salt: salt,
    password: password,
    isVerified: values.isVerified,
  };
  const dbUserEmail: DbUserEmail = {
    ...uniqueEmailKey,
    userId,
  };
  const dbUsernameEmail: DbUserUsername = {
    ...uniqueUsernameKey,
    userId,
  };

  await putItems([dbUser, dbUserEmail, dbUsernameEmail]);

  return dbUser;
}
