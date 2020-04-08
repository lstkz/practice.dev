import { AuthData } from 'shared';
import { createToken } from './createToken';
import { UserEntity } from '../../entities/UserEntity';
import { UserEntity as UserEntity2 } from '../../entities2/UserEntity';

export async function _generateAuthData(
  user: UserEntity | UserEntity2
): Promise<AuthData> {
  return {
    user: user.toUser(),
    token: await createToken(user.userId, null),
  };
}
