import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { _createUser } from './_createUser';
import { UserUsernameEntity, UserEntity } from '../../entities';
import { AppError } from '../../common/errors';

export const getPublicProfile = createContract('user.getPublicProfile')
  .params('userId', 'username')
  .schema({
    userId: S.string().optional(),
    username: S.string(),
  })
  .fn(async (_, username) => {
    const usernameEntity = await UserUsernameEntity.getByKeyOrNull({
      username,
    });
    if (!usernameEntity) {
      throw new AppError('User not found');
    }
    const user = await UserEntity.getById(usernameEntity.userId);

    return user.toPublicUserProfile(false);
  });

export const getPublicProfileRpc = createRpcBinding({
  public: true,
  injectUser: true,
  signature: 'user.getPublicProfile',
  handler: getPublicProfile,
});
