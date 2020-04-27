import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { UserCollection } from '../../collections/UserModel';
import { mapToUser } from '../../common/mapper';

export const getMe = createContract('user.getMe')
  .params('userId')
  .schema({
    userId: S.string(),
  })
  .fn(async userId => {
    const user = await UserCollection.findOneOrThrow({ userId });
    return mapToUser(user);
  });

export const getMeRpc = createRpcBinding({
  injectUser: true,
  signature: 'user.getMe',
  handler: getMe,
});
