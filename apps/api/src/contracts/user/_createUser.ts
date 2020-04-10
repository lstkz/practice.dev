import { randomSalt, createPasswordHash } from '../../common/helper';
import uuid from 'uuid';
import {
  UserEmailEntity,
  UserUsernameEntity,
  UserEntity,
  GithubUserEntity,
} from '../../entities';
import { createTransaction } from '../../lib';
import { AppError } from '../../common/errors';

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
  const salt = await randomSalt();
  const password = await createPasswordHash(values.password, salt);
  const userEmail = new UserEmailEntity({
    userId,
    email: values.email,
  });
  const userUsername = new UserUsernameEntity({
    userId,
    username: values.username,
  });
  const user = new UserEntity({
    userId: userId,
    email: values.email,
    username: values.username,
    salt: salt,
    password: password,
    isVerified: values.isVerified,
    githubId: values.githubId,
  });

  await Promise.all([
    UserEmailEntity.getIsTaken(values.email).then(isTaken => {
      if (isTaken) {
        throw new AppError('Email is already registered');
      }
    }),
    UserUsernameEntity.getIsTaken(values.username).then(isTaken => {
      if (isTaken) {
        throw new AppError('Username is already taken');
      }
    }),
  ]);

  const t = createTransaction();
  t.insert(userEmail, {
    conditionExpression: 'attribute_not_exists(pk)',
  });
  t.insert(userUsername, {
    conditionExpression: 'attribute_not_exists(pk)',
  });
  t.insert(user);
  if (values.githubId) {
    t.insert(
      new GithubUserEntity({
        userId,
        githubId: values.githubId,
      })
    );
  }
  await t.commit();
  return user;
}
