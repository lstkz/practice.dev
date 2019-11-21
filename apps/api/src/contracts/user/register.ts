import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';

export const register = createContract('user.register')
  .params('values')
  .schema({
    values: S.object().keys({
      username: S.string(),
    }),
  })

  .fn(async values => {
    const userId = Date.now();
    console.log(`user ${userId} registered`);

    return {
      ok: 123,
    };
  });

export const registerRpc = createRpcBinding({
  public: true,
  signature: 'user.register',
  handler: register,
});
