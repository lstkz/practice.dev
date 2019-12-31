import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { getEmail } from '../../common/google';
import { createKey, getItem } from '../../common/db';
import { DbUserEmail } from '../../types';
import { getDbUserById } from './getDbUserById';
import { _generateAuthData } from './_generateAuthData';
import { _createUser } from './_createUser';
import { _getNextUsername } from './_getNextUsername';
import { randomUniqString } from '../../common/helper';

export const authGoogle = createContract('auth.authGoogle')
  .params('accessToken')
  .schema({
    accessToken: S.string(),
  })
  .fn(async accessToken => {
    const email = await getEmail(accessToken);
    const emailKey = createKey({ type: 'USER_EMAIL', email });
    const dbUserEmail = await getItem<DbUserEmail>(emailKey);
    if (dbUserEmail) {
      const user = await getDbUserById(dbUserEmail.userId);
      return _generateAuthData(user);
    }
    const createdUser = await _createUser({
      email,
      username: await _getNextUsername(email.split('@')[0]),
      password: randomUniqString(),
      isVerified: true,
    });
    return _generateAuthData(createdUser);
  });

export const authGoogleRpc = createRpcBinding({
  public: true,
  signature: 'user.authGoogle',
  handler: authGoogle,
});
