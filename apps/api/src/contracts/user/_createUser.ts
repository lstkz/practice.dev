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
  const userIdKey = createKey('USER', userId);
  const uniqueEmailKey = createKey('USER_EMAIL', values.email);
  const uniqueUsernameKey = createKey('USER_USERNAME', values.username);
  const salt = await randomSalt();
  const password = await createPasswordHash(values.password, salt);

  await Promise.all([
    ensureNotExists(
      {
        pk: uniqueEmailKey,
        sk: uniqueEmailKey,
      },
      'Email is already registered'
    ),
    ensureNotExists(
      {
        pk: uniqueUsernameKey,
        sk: uniqueUsernameKey,
      },
      'Username is already taken'
    ),
  ]);

  const dbUser: DbUser = {
    pk: userIdKey,
    sk: userIdKey,
    userId: userId,
    email: values.email,
    username: values.username,
    salt: salt,
    password: password,
    isVerified: values.isVerified,
  };
  const dbUserEmail: DbUserEmail = {
    pk: uniqueEmailKey,
    sk: uniqueEmailKey,
    userId,
  };
  const dbUsernameEmail: DbUserUsername = {
    pk: uniqueUsernameKey,
    sk: uniqueUsernameKey,
    userId,
  };

  await putItems([dbUser, dbUserEmail, dbUsernameEmail]);

  return dbUser;
}
