import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import * as userReader from '../../readers/userReader';

export const getMe = createContract('user.getMe')
  .params('userId')
  .schema({
    userId: S.string(),
  })
  .fn(async userId => {
    const user = await userReader.getById(userId);
    return user.toUser();
  });

export const getMeRpc = createRpcBinding({
  injectUser: true,
  signature: 'user.getMe',
  handler: getMe,
});
