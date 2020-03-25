import * as R from 'remeda';
import * as db from '../common/db-next';
import { Converter } from 'aws-sdk/clients/dynamodb';
import {
  UserEmailEntity,
  UserEntity,
  GithubUserEntity,
  ConfirmCodeEntity,
  ResetPasswordCodeEntity,
  UserUsernameEntity,
  TokenEntity,
} from '../entities';
import { TABLE_NAME } from '../config';

export async function getIdByEmailOrNull(email: string) {
  const user = await db.getOrNull(UserEmailEntity, {
    email,
  });
  return user?.userId;
}

export async function getIdByUsernameOrNull(username: string) {
  const user = await db.getOrNull(UserUsernameEntity, {
    username,
  });
  return user?.userId;
}

export async function getById(id: string) {
  return await db.get(UserEntity, {
    userId: id,
  });
}

export async function getIdByGithubIdOrNull(githubId: number) {
  const user = await db.getOrNull(GithubUserEntity, {
    githubId,
  });
  return user?.userId;
}

export async function getConfirmCodeOrNull(code: string) {
  return await db.getOrNull(ConfirmCodeEntity, {
    code,
  });
}

export async function getResetPasswordOrNull(code: string) {
  return await db.getOrNull(ResetPasswordCodeEntity, {
    code,
  });
}

export async function getUserIdByEmailOrUsernameOrNull(
  emailOrUsername: string
) {
  if (emailOrUsername.includes('@')) {
    const item = await db.getOrNull(UserEmailEntity, {
      email: emailOrUsername,
    });
    return item?.userId;
  } else {
    const item = await db.getOrNull(UserUsernameEntity, {
      username: emailOrUsername,
    });
    return item?.userId;
  }
}

export async function getByTokenOrNull(token: string) {
  const tokenEntity = await db.getOrNull(TokenEntity, {
    token,
  });
  if (!tokenEntity) {
    return null;
  }
  return getById(tokenEntity.userId);
}

export async function getByIds(ids: string[]) {
  if (!ids.length) {
    return [];
  }
  const keys = R.pipe(
    ids,
    R.uniq(),
    R.map(userId => UserEntity.createKey({ userId })),
    R.map(key => Converter.marshall(key))
  );

  const items = await db.batchGetItemWithRetry({
    [TABLE_NAME]: {
      Keys: keys,
    },
  });
  return (items[TABLE_NAME] || []).map(
    item => new UserEntity(Converter.unmarshall(item) as any)
  );
}
