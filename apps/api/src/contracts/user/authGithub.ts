import { S } from 'schema';
import { createContract } from '../../lib';
import { exchangeCode, getUserData, GitHubUserData } from '../../common/github';
import {
  createKey,
  getItem,
  transactWriteItems,
  prepareUpdate,
} from '../../common/db';
import { DbGithubUser, DbUserEmail } from '../../types';
import { getDbUserById } from './getDbUserById';
import { _generateAuthData } from './_generateAuthData';
import { AppError } from '../../common/errors';
import { _createUser } from './_createUser';
import { randomUniqString } from '../../common/helper';
import { _getNextUsername } from './_getNextUsername';

async function _connectByEmail(githubUser: GitHubUserData) {
  const uniqueEmailKey = createKey({
    type: 'USER_EMAIL',
    email: githubUser.email,
  });
  const dbUserEmail = await getItem<DbUserEmail>(uniqueEmailKey);
  if (!dbUserEmail) {
    return null;
  }
  const dbUser = await getDbUserById(dbUserEmail.userId);
  if (dbUser.githubId) {
    throw new AppError(
      `Cannot register a new user. Another user with email ${githubUser.email} is already connected with different GitHub account.`
    );
  }
  dbUser.githubId = githubUser.id;
  const githubUserKey = createKey({ type: 'GITHUB_USER', id: githubUser.id });
  const dbGithubUser: DbGithubUser = {
    ...githubUserKey,
    userId: dbUser.userId,
    githubId: githubUser.id,
  };

  await transactWriteItems({
    putItems: [dbGithubUser],
    updateItems: [prepareUpdate(dbUser, ['githubId'])],
  });

  return dbUser;
}

export const authGithub = createContract('auth.authGithub')
  .params('code')
  .schema({
    code: S.string(),
  })
  .fn(async code => {
    const accessToken = await exchangeCode(code);
    const githubUser = await getUserData(accessToken);
    const githubUserKey = createKey({ type: 'GITHUB_USER', id: githubUser.id });
    const existingGithubUser = await getItem<DbGithubUser>(githubUserKey);

    // already connected
    if (existingGithubUser) {
      const user = await getDbUserById(existingGithubUser.userId);
      return _generateAuthData(user);
    }

    // not connected, but email already registered
    const connectedByEmailUser = await _connectByEmail(githubUser);
    if (connectedByEmailUser) {
      return _generateAuthData(connectedByEmailUser);
    }

    // not connected, register a new user
    const createdUser = await _createUser({
      email: githubUser.email,
      githubId: githubUser.id,
      username: await _getNextUsername(githubUser.username),
      password: randomUniqString(),
      isVerified: true,
    });
    return _generateAuthData(createdUser);
  });
