import { randomSalt, createPasswordHash } from '../../common/helper';
import uuid from 'uuid';
import { DbUser } from '../../models/DbUser';
import { DbUserEmail } from '../../models/DbUserEmail';
import { DbUserUsername } from '../../models/DbUserUsername';
import { DbGithubUser } from '../../models/DbGithubUser';
import { ensureNotExists, putItems, BaseEntity } from '../../common/db-next';

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
  const dbUserEmail = new DbUserEmail({
    userId,
    email: values.email,
  });
  const dbUserUsername = new DbUserUsername({
    userId,
    username: values.username,
  });

  await Promise.all([
    ensureNotExists(dbUserEmail.key, 'Email is already registered'),
    ensureNotExists(dbUserUsername.key, 'Username is already taken'),
  ]);

  const dbUser = new DbUser({
    userId: userId,
    email: values.email,
    username: values.username,
    salt: salt,
    password: password,
    isVerified: values.isVerified,
    githubId: values.githubId,
  });
  const entities: BaseEntity[] = [dbUser, dbUserEmail, dbUserUsername];
  if (values.githubId) {
    entities.push(
      new DbGithubUser({
        userId,
        githubId: values.githubId,
      })
    );
  }

  await putItems(entities);
  return dbUser;
}
