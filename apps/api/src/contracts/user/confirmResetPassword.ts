import { S } from 'schema';
import { createContract, createRpcBinding, createTransaction } from '../../lib';
import { _createUser } from './_createUser';
import { AppError } from '../../common/errors';
import { createPasswordHash } from '../../common/helper';
import { _generateAuthData } from './_generateAuthData';
import { UserEntity, ResetPasswordCodeEntity } from '../../entities2';

export const confirmResetPassword = createContract('user.confirmResetPassword')
  .params('code', 'newPassword')
  .schema({
    code: S.string(),
    newPassword: S.string().min(5),
  })
  .fn(async (code, newPassword) => {
    const resetCode = await ResetPasswordCodeEntity.getByKeyOrNull({ code });
    if (!resetCode) {
      throw new AppError('Invalid or used reset code');
    }
    if (resetCode.expireAt < Date.now()) {
      throw new AppError('Expired code. Please request password reset again.');
    }
    const user = await UserEntity.getByKey({ userId: resetCode.userId });
    const hashedPassword = await createPasswordHash(newPassword, user.salt);
    user.password = hashedPassword;
    const t = createTransaction();
    t.update(user, ['password']);
    t.delete(resetCode);
    await t.commit();
    return _generateAuthData(user);
  });

export const confirmResetPasswordRpc = createRpcBinding({
  public: true,
  signature: 'user.confirmResetPassword',
  handler: confirmResetPassword,
});
