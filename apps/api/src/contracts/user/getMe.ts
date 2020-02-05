import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { mapDbUser } from '../../common/mapping';
import { getDbUserById } from './getDbUserById';

export const getMe = createContract('user.getMe')
  .params('userId')
  .schema({
    userId: S.string(),
  })
  .fn(async userId => {
    const user = await getDbUserById(userId);
    return mapDbUser(user);
  });

export const getMeRpc = createRpcBinding({
  injectUser: true,
  signature: 'user.getMe',
  handler: getMe,
});
