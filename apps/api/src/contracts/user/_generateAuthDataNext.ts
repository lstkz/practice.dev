import { AuthData } from 'shared';
import { createToken } from './createToken';
import { UserEntity } from '../../entities/UserEntity';

export async function _generateAuthData(user: UserEntity): Promise<AuthData> {
  return {
    user: user.toUser(),
    token: await createToken(user.userId, null),
  };
}
