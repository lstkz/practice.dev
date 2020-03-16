import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { _createUser } from './_createUser';
import { _generateAuthData } from './_generateAuthData';
import { createKey, getItemEnsure } from '../../common/db';
import { DbUser } from '../../types';
import { AppError } from '../../common/errors';
import { createPasswordHash } from '../../common/helper';
import { _getEmailOrUsernameEntity } from './_getEmailOrUsernameEntity';

const INVALID_CRED = 'Invalid credentials or user not found';

export const login = createContract('user.login')
  .params('values')
  .schema({
    values: S.object().keys({
      emailOrUsername: S.string().trim(),
      password: S.string(),
    }),
  })

  .fn(async values => {
    const { emailOrUsername } = values;

    const dbUserEmailOrUsername = await _getEmailOrUsernameEntity(
      emailOrUsername
    );
    if (!dbUserEmailOrUsername) {
      throw new AppError(INVALID_CRED);
    }
    const dbUser = await getItemEnsure<DbUser>(
      createKey({ type: 'USER', userId: dbUserEmailOrUsername.userId })
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
