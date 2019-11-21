import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { _createUser } from './_createUser';
import { _generateAuthData } from './_generateAuthData';

export const register = createContract('user.register')
  .params('values')
  .schema({
    values: S.object().keys({
      email: S.string()
        .email()
        .trim(),
      username: S.string()
        .trim()
        .regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i)
        .min(3)
        .max(38),
      password: S.string().min(5),
    }),
  })

  .fn(async values => {
    const dbUser = await _createUser({
      ...values,
      isVerified: false,
    });

    return _generateAuthData(dbUser);
  });

export const registerRpc = createRpcBinding({
  public: true,
  signature: 'user.register',
  handler: register,
});
