import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import * as db from '../../common/db-next';
import { UserEntity } from '../../entities';

export const getMe = createContract('user.getMe')
  .params('userId')
  .schema({
    userId: S.string(),
  })
  .fn(async userId => {
    const user = await db.get(UserEntity, {
      userId,
    });
    return user.toUser();
  });

export const getMeRpc = createRpcBinding({
  injectUser: true,
  signature: 'user.getMe',
  handler: getMe,
});
