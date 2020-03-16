import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { exchangeCode, getUserData, GitHubUserData } from '../../common/github';
import { _generateAuthData } from './_generateAuthDataNext';
import { AppError } from '../../common/errors';
import { _createUser } from './_createUser';
import { randomUniqString } from '../../common/helper';
import { _getNextUsername } from './_getNextUsername';
import { DbUserEmail } from '../../models/DbUserEmail';
import { DbGithubUser } from '../../models/DbGithubUser';
import * as db from '../../common/db-next';
import { DbUser } from '../../models/DbUser';

async function _connectByEmail(githubUser: GitHubUserData) {
  const dbUserEmail = await db.getOrNull(DbUserEmail, {
    email: githubUser.email,
  });
  if (!dbUserEmail) {
    return null;
  }
  const dbUser = await db.get(DbUser, {
    userId: dbUserEmail.userId,
  });
  if (dbUser.githubId) {
    throw new AppError(
      `Cannot register a new user. Another user with email ${githubUser.email} is already connected with different GitHub account.`
    );
  }
  dbUser.githubId = githubUser.id;
  const dbGithubUser = new DbGithubUser({
    userId: dbUser.userId,
    githubId: githubUser.id,
  });
  await db.transactWriteItems([
    {
      Put: dbGithubUser.preparePut(),
    },
    {
      Update: dbUser.prepareUpdate(['githubId']),
    },
  ]);
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
    const existingGithubUser = await db.getOrNull(DbGithubUser, {
      githubId: githubUser.id,
    });

    // already connected
    if (existingGithubUser) {
      const user = await db.get(DbUser, {
        userId: existingGithubUser.userId,
      });
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

export const authGithubRpc = createRpcBinding({
  public: true,
  signature: 'user.authGithub',
  handler: authGithub,
});
