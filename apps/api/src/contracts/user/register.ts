import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { dispatch } from '../../dispatch';
import { _generateAuthData } from './_generateAuthData';
import { UserCollection } from '../../collections/UserModel';
import { AppError } from '../../common/errors';
import { _createUser } from './_createUser';

export const register = createContract('user.register')
  .params('values')
  .schema({
    values: S.object().keys({
      email: S.string().email().trim(),
      username: S.string()
        .trim()
        .regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i)
        .min(3)
        .max(38),
      password: S.string().min(5),
    }),
  })
  .fn(async values => {
    await Promise.all([
      UserCollection.findOne({
        email_lowered: values.email.toLowerCase(),
      }).then(exists => {
        if (exists) {
          throw new AppError('Email is already registered');
        }
      }),
      UserCollection.findOne({
        username_lowered: values.username.toLowerCase(),
      }).then(exists => {
        if (exists) {
          throw new AppError('Username is already taken');
        }
      }),
    ]);

    const user = await _createUser({ ...values, isVerified: false });

    await dispatch({
      type: 'UserRegisteredEvent',
      payload: {
        registeredAt: new Date().toISOString(),
        userId: user._id,
      },
    });

    return _generateAuthData(user);
  });

export const registerRpc = createRpcBinding({
  public: true,
  signature: 'user.register',
  handler: register,
});
