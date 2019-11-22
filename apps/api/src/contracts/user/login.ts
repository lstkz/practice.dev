import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { _createUser } from './_createUser';
import { _generateAuthData } from './_generateAuthData';
import { createKey, getItem, getItemEnsure } from '../../common/db';
import { DbUserEmail, DbUser } from '../../types';
import { AppError } from '../../common/errors';
import { createPasswordHash } from '../../common/helper';

const INVALID_CRED = 'Invalid credentials or user not found';

export const login = createContract('user.login')
  .params('values')
  .schema({
    values: S.object().keys({
      email: S.string()
        .email()
        .trim(),
      password: S.string(),
    }),
  })

  .fn(async values => {
    const dbUserEmail = await getItem<DbUserEmail>(
      createKey('USER_EMAIL', values.email)
    );
    if (!dbUserEmail) {
      throw new AppError(INVALID_CRED);
    }
    const dbUser = await getItemEnsure<DbUser>(
      createKey('USER', dbUserEmail.userId)
    );

    const hash = await createPasswordHash(values.password, dbUser!.salt);
    if (dbUser.password !== hash) {
      throw new AppError(INVALID_CRED);
    }

    return _generateAuthData(dbUser);
  });

export const loginRpc = createRpcBinding({
  public: true,
  signature: 'user.login',
  handler: login,
});
