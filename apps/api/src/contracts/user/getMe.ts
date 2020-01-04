import { createContract, createRpcBinding, getLoggedInUser } from '../../lib';
import { mapDbUser } from '../../common/mapping';

export const getMe = createContract('user.getMe')
  .params()
  .fn(async () => {
    const user = getLoggedInUser();
    return mapDbUser(user);
  });

export const getMeRpc = createRpcBinding({
  signature: 'user.getMe',
  handler: getMe,
});
