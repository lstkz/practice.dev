import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { getEmail } from '../../common/google';
import { _createUser } from './_createUser';
import { _getNextUsername } from './_getNextUsername';
import { randomUniqString } from '../../common/helper';
import * as db from '../../common/db-next';
import { _generateAuthData } from './_generateAuthData';
import { UserEmailEntity, UserEntity } from '../../entities';

export const authGoogle = createContract('auth.authGoogle')
  .params('accessToken')
  .schema({
    accessToken: S.string(),
  })
  .fn(async accessToken => {
    const email = await getEmail(accessToken);
    const userEmail = await db.getOrNull(UserEmailEntity, {
      email,
    });
    if (userEmail) {
      const user = await db.get(UserEntity, {
        userId: userEmail.userId,
      });
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
