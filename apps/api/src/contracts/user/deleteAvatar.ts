import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { UserEntity } from '../../entities';

export const deleteAvatar = createContract('user.deleteAvatar')
  .params('userId')
  .schema({
    userId: S.string(),
  })
  .fn(async userId => {
    const user = await UserEntity.getById(userId);
    user.avatarUrl = null;
    await user.update(['avatarUrl']);
  });

export const deleteAvatarRpc = createRpcBinding({
  injectUser: true,
  signature: 'user.deleteAvatar',
  handler: deleteAvatar,
});
