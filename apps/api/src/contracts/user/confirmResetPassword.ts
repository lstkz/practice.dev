import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { _createUser } from './_createUser';
import { _generateAuthData } from './_generateAuthData';
import { AppError } from '../../common/errors';
import { _getDbUserByEmailOrUsername } from './_getDbUserByEmailOrUsername';
import { createPasswordHash } from '../../common/helper';
import {
  createKey,
  getItem,
  transactWriteItems,
  prepareUpdate,
} from '../../common/db';
import { DbResetPasswordCode } from '../../types';
import { getDbUserById } from './getDbUserById';

export const confirmResetPassword = createContract('user.confirmResetPassword')
  .params('code', 'newPassword')
  .schema({
    code: S.string(),
    newPassword: S.string().min(5),
  })
  .fn(async (code, newPassword) => {
    const resetKey = createKey({ type: 'RESET_PASSWORD_CODE', code });
    const dbResetCode = await getItem<DbResetPasswordCode>(resetKey);
    if (!dbResetCode) {
      throw new AppError('Invalid or used reset code');
    }
    if (dbResetCode.expireAt < Date.now()) {
      throw new AppError('Expired code. Please request password reset again.');
    }
    const dbUser = await getDbUserById(dbResetCode.userId);
    const hashedPassword = await createPasswordHash(newPassword, dbUser.salt);
    dbUser.password = hashedPassword;

    await transactWriteItems({
      deleteItems: [resetKey],
      updateItems: [prepareUpdate(dbUser, ['password'])],
    });

    return _generateAuthData(dbUser);
  });

export const confirmResetPasswordRpc = createRpcBinding({
  public: true,
  signature: 'user.confirmResetPassword',
  handler: confirmResetPassword,
});
