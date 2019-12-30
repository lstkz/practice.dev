import { createContract, getContext, createRpcBinding } from '../../lib';
import { mapDbUser } from '../../common/mapping';

export const getMe = createContract('user.getMe')
  .params()
  .fn(async () => {
    const { user } = getContext();
    return mapDbUser(user);
  });

export const getMeRpc = createRpcBinding({
  signature: 'user.getMe',
  handler: getMe,
});
