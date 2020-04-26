import { AuthData } from 'shared';
import { UserModel } from '../../collections/UserModel';
import { createToken } from './createToken';

export async function _generateAuthData(user: UserModel): Promise<AuthData> {
  return {
    user: {
      email: user.email,
      id: user._id,
      isVerified: user.isVerified,
      username: user.username,
      isAdmin: user.isAdmin,
    },
    token: await createToken(user._id, null),
  };
}
