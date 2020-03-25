import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { exchangeCode, getUserData, GitHubUserData } from '../../common/github';
import { _generateAuthData } from './_generateAuthData';
import { AppError } from '../../common/errors';
import { _createUser } from './_createUser';
import { randomUniqString } from '../../common/helper';
import { _getNextUsername } from './_getNextUsername';
import * as db from '../../common/db-next';
import * as userReader from '../../readers/userReader';
import { GithubUserEntity } from '../../entities';

async function _connectByEmail(githubUser: GitHubUserData) {
  const userId = await userReader.getIdByEmailOrNull(githubUser.email);
  if (!userId) {
    return null;
  }
  const user = await userReader.getById(userId);
  if (user.githubId) {
    throw new AppError(
      `Cannot register a new user. Another user with email ${githubUser.email} is already connected with different GitHub account.`
    );
  }
  user.githubId = githubUser.id;
  const dbGithubUser = new GithubUserEntity({
    userId: user.userId,
    githubId: githubUser.id,
  });
  await db.transactWriteItems([
    {
      Put: dbGithubUser.preparePut(),
    },
    {
      Update: user.prepareUpdate(['githubId']),
    },
  ]);
  return user;
}

export const authGithub = createContract('auth.authGithub')
  .params('code')
  .schema({
    code: S.string(),
  })
  .fn(async code => {
    const accessToken = await exchangeCode(code);
    const githubUser = await getUserData(accessToken);
    const userIdByGithub = await userReader.getIdByGithubIdOrNull(
      githubUser.id
    );

    // already connected
    if (userIdByGithub) {
      const user = await userReader.getById(userIdByGithub);
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
