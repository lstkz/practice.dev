import { S } from 'schema';
import * as R from 'remeda';
import { createContract, createRpcBinding } from '../../lib';
import { _createUser } from './_createUser';
import { AppError } from '../../common/errors';
import { createPasswordHash } from '../../common/helper';
import { _generateAuthData } from './_generateAuthData';
import { ResetPasswordCollection } from '../../collections/ResetPassword';
import { UserCollection } from '../../collections/UserModel';

export const confirmResetPassword = createContract('user.confirmResetPassword')
  .params('code', 'newPassword')
  .schema({
    code: S.string(),
    newPassword: S.string().min(5),
  })
  .fn(async (code, newPassword) => {
    const resetCode = await ResetPasswordCollection.findOne({ _id: code });
    if (!resetCode) {
      throw new AppError('Invalid or used reset code');
    }
    if (resetCode.expireAt.getTime() < Date.now()) {
      throw new AppError('Expired code. Please request password reset again.');
    }
    const user = await UserCollection.findOneOrThrow({ _id: resetCode.userId });
    const hashedPassword = await createPasswordHash(newPassword, user.salt);
    user.password = hashedPassword;
    await UserCollection.findOneAndUpdate(
      { _id: resetCode.userId },
      { $set: R.pick(user, ['password']) }
    );
    await ResetPasswordCollection.findOneAndDelete({ _id: code });
    return _generateAuthData(user);
  });

export const confirmResetPasswordRpc = createRpcBinding({
  public: true,
  signature: 'user.confirmResetPassword',
  handler: confirmResetPassword,
});
