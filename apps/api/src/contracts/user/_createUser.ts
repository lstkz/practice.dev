import { randomSalt, createPasswordHash } from '../../common/helper';
import uuid from 'uuid';
import { BaseEntity } from '../../common/orm';
import * as db from '../../common/db-next';
import {
  UserEmailEntity,
  UserUsernameEntity,
  UserEntity,
  GithubUserEntity,
} from '../../entities';

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

  await Promise.all([
    db.ensureNotExists(userEmail.key, 'Email is already registered'),
    db.ensureNotExists(userUsername.key, 'Username is already taken'),
  ]);

  const user = new UserEntity({
    userId: userId,
    email: values.email,
    username: values.username,
    salt: salt,
    password: password,
    isVerified: values.isVerified,
    githubId: values.githubId,
  });
  const entities: BaseEntity[] = [user, userEmail, userUsername];
  if (values.githubId) {
    entities.push(
      new GithubUserEntity({
        userId,
        githubId: values.githubId,
      })
    );
  }

  await db.put(entities);
  return user;
}
