import { AuthData } from 'shared';
import { createToken } from './createToken';
import { DbUser } from '../../types';
import { mapDbUser } from '../../common/mapping';

export async function _generateAuthData(dbUser: DbUser): Promise<AuthData> {
  return {
    user: mapDbUser(dbUser),
    token: await createToken(dbUser.userId, null),
  };
}
