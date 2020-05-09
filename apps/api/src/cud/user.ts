import { Transaction } from '../orm/Transaction';
import { TABLE_NAME } from '../config';
import {
  UserEntity,
  UserStats,
  UserProps,
  UserEmailEntity,
  UserUsernameEntity,
  GithubUserEntity,
} from '../entities';
import { AppError } from '../common/errors';
import { createTransaction } from '../lib';

export function updateUserStats(
  t: Transaction,
  userId: string,
  name: keyof UserStats,
  add: number
) {
  t.updateRaw({
    tableName: TABLE_NAME,
    key: UserEntity.createKey({ userId }),
    updateExpression: `SET stats.${name} = if_not_exists(stats.${name}, :zero) + :inc`,
    expressionValues: {
      ':inc': add,
      ':zero': 0,
    },
  });
}

export async function createUserCUD(props: UserProps) {
  const userEmail = new UserEmailEntity({
    userId: props.userId,
    email: props.email,
  });
  const userUsername = new UserUsernameEntity({
    userId: props.userId,
    username: props.username,
  });
  const user = new UserEntity(props);

  await Promise.all([
    UserEmailEntity.getIsTaken(props.email).then(isTaken => {
      if (isTaken) {
        throw new AppError('Email is already registered');
      }
    }),
    UserUsernameEntity.getIsTaken(props.username).then(isTaken => {
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
  if (props.githubId) {
    t.insert(
      new GithubUserEntity({
        userId: props.userId,
        githubId: props.githubId,
      })
    );
  }
  await t.commit();
  return user;
}

export async function updateEmailCUD(user: UserEntity, newEmail: string) {
  const t = createTransaction();
  if (user.email.toLowerCase() !== newEmail.toLowerCase()) {
    await UserEmailEntity.getIsTaken(newEmail).then(isTaken => {
      if (isTaken) {
        throw new AppError('Email is already registered');
      }
    });
    const oldUserEmail = new UserEmailEntity({
      userId: user.userId,
      email: user.email,
    });
    const newUserEmail = new UserEmailEntity({
      userId: user.userId,
      email: newEmail,
    });
    t.delete(oldUserEmail, {
      conditionExpression: 'attribute_exists(pk)',
    });
    t.insert(newUserEmail, {
      conditionExpression: 'attribute_not_exists(pk)',
    });
  }
  user.email = newEmail;
  t.update(user, ['email']);
  await t.commit();
  return user;
}
