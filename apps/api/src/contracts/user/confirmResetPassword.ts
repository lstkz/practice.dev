import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { _createUser } from './_createUser';
import { AppError } from '../../common/errors';
import { createPasswordHash } from '../../common/helper';
import * as db from '../../common/db-next';
import * as userReader from '../../readers/userReader';
import { _generateAuthData } from './_generateAuthData';

export const confirmResetPassword = createContract('user.confirmResetPassword')
  .params('code', 'newPassword')
  .schema({
    code: S.string(),
    newPassword: S.string().min(5),
  })
  .fn(async (code, newPassword) => {
    const resetCode = await userReader.getResetPasswordOrNull(code);
    if (!resetCode) {
      throw new AppError('Invalid or used reset code');
    }
    if (resetCode.expireAt < Date.now()) {
      throw new AppError('Expired code. Please request password reset again.');
    }
    const user = await userReader.getById(resetCode.userId);
    const hashedPassword = await createPasswordHash(newPassword, user.salt);
    user.password = hashedPassword;

    await db.transactWriteItems([
      { Delete: resetCode.prepareDelete() },
      { Update: user.prepareUpdate(['password']) },
    ]);
    return _generateAuthData(user);
  });

export const confirmResetPasswordRpc = createRpcBinding({
  public: true,
  signature: 'user.confirmResetPassword',
  handler: confirmResetPassword,
});
