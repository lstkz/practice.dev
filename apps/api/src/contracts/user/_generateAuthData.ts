import { AuthData } from 'shared';
import { createToken } from './createToken';
import { DbUser } from '../../types';

export async function _generateAuthData(dbUser: DbUser): Promise<AuthData> {
  return {
    user: {
      id: dbUser.userId,
      email: dbUser.email,
      username: dbUser.username,
      isVerified: dbUser.isVerified,
    },
    token: await createToken(dbUser.userId, null),
  };
}
