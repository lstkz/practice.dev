import { S } from 'schema';
import { createContract, createRpcBinding, createTransaction } from '../../lib';
import { exchangeCode, getUserData, GitHubUserData } from '../../common/github';
import { _generateAuthData } from './_generateAuthData';
import { AppError } from '../../common/errors';
import { _createUser } from './_createUser';
import { randomUniqString } from '../../common/helper';
import { _getNextUsername } from './_getNextUsername';
import { UserEmailEntity, UserEntity, GithubUserEntity } from '../../entities';

async function _connectByEmail(githubData: GitHubUserData) {
  const email = await UserEmailEntity.getByKeyOrNull({
    email: githubData.email,
  });
  if (!email) {
    return null;
  }
  const user = await UserEntity.getByKey({ userId: email.userId });
  if (user.githubId) {
    throw new AppError(
      `Cannot register a new user. Another user with email ${githubData.email} is already connected with different GitHub account.`
    );
  }
  user.githubId = githubData.id;
  const githubUser = new GithubUserEntity({
    userId: user.userId,
    githubId: githubData.id,
  });
  const t = createTransaction();
  t.insert(githubUser);
  t.update(user, ['githubId']);
  await t.commit();
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
    const githubUser = await GithubUserEntity.getByKeyOrNull({
      githubId: githubData.id,
    });

    // already connected
    if (githubUser) {
      const user = await UserEntity.getByKey({ userId: githubUser.userId });
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
