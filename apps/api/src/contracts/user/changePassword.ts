import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { UserEntity } from '../../entities';
import { createPasswordHash } from '../../common/helper';
import { getPasswordSchema } from 'shared';

export const changePassword = createContract('user.changePassword')
  .params('userId', 'newPassword')
  .schema({
    userId: S.string(),
    newPassword: getPasswordSchema(),
  })
  .fn(async (userId, newPassword) => {
    const user = await UserEntity.getById(userId);
    const password = await createPasswordHash(newPassword, user.salt);
    user.password = password;
    await user.update(['password']);
  });

export const changePasswordRpc = createRpcBinding({
  injectUser: true,
  signature: 'user.changePassword',
  handler: changePassword,
});
