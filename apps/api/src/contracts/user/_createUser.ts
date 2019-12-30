import { randomSalt, createPasswordHash } from '../../common/helper';
import uuid from 'uuid';
import { createKey, ensureNotExists, putItems } from '../../common/db';
import { DbUser, DbUserUsername, DbUserEmail, DbGithubUser } from '../../types';

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
    githubId: values.githubId,
  };
  const dbUserEmail: DbUserEmail = {
    ...uniqueEmailKey,
    email: values.email,
    userId,
  };
  const dbUsernameEmail: DbUserUsername = {
    ...uniqueUsernameKey,
    username: values.username,
    userId,
  };
  const entities: any[] = [dbUser, dbUserEmail, dbUsernameEmail];
  if (values.githubId) {
    const dbGithubUser: DbGithubUser = {
      ...createKey({ type: 'GITHUB_USER', id: values.githubId }),
      userId,
      githubId: values.githubId,
    };
    entities.push(dbGithubUser);
  }

  await putItems(entities);

  return dbUser;
}
