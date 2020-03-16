import { AuthData } from 'shared';
import { createToken } from './createToken';
import { DbUser } from '../../models/DbUser';

export async function _generateAuthData(dbUser: DbUser): Promise<AuthData> {
  return {
    user: dbUser.toUser(),
    token: await createToken(dbUser.userId, null),
  };
}
