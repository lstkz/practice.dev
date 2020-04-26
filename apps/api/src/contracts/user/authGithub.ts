import * as R from 'remeda';
import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { exchangeCode, getUserData, GitHubUserData } from '../../common/github';
import { _generateAuthData } from './_generateAuthData';
import { AppError } from '../../common/errors';
import { _createUser } from './_createUser';
import { randomUniqString } from '../../common/helper';
import { _getNextUsername } from './_getNextUsername';
import { UserCollection } from '../../collections/UserModel';

async function _connectByEmail(githubData: GitHubUserData) {
  const user = await UserCollection.findOne({
    email_lowered: githubData.email.toLowerCase(),
  });
  if (!user) {
    return null;
  }
  if (user.githubId) {
    throw new AppError(
      `Cannot register a new user. Another user with email ${githubData.email} is already connected with different GitHub account.`
    );
  }
  user.githubId = githubData.id;
  await UserCollection.findOneAndUpdate(
    {
      _id: user._id,
    },
    {
      $set: R.pick(user, ['githubId']),
    }
  );
  return user;
}

export const authGithub = createContract('auth.authGithub')
  .params('code')
  .schema({
    code: S.string(),
  })
  .fn(async code => {
    const accessToken = await exchangeCode(code);
    const githubData = await getUserData(accessToken);
    const user = await UserCollection.findOne({
      githubId: githubData.id,
    });

    // already connected
    if (user) {
      return _generateAuthData(user);
    }

    // not connected, but email already registered
    const connectedByEmailUser = await _connectByEmail(githubData);
    if (connectedByEmailUser) {
      return _generateAuthData(connectedByEmailUser);
    }

    // not connected, register a new user
    const createdUser = await _createUser({
      email: githubData.email,
      githubId: githubData.id,
      username: await _getNextUsername(githubData.username),
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
