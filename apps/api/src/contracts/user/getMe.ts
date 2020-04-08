import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { UserEntity } from '../../entities2';

export const getMe = createContract('user.getMe')
  .params('userId')
  .schema({
    userId: S.string(),
  })
  .fn(async userId => {
    const user = await UserEntity.getByKey({ userId });
    return user.toUser();
  });

export const getMeRpc = createRpcBinding({
  injectUser: true,
  signature: 'user.getMe',
  handler: getMe,
});
