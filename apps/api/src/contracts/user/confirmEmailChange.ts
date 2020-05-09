import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { UserEntity } from '../../entities';
import { AppError } from '../../common/errors';
import { ChangeEmailRequestEntity } from '../../entities/ChangeEmailRequestEntity';
import { updateEmailCUD } from '../../cud/user';
import { _generateAuthData } from './_generateAuthData';

export const confirmEmailChange = createContract('user.confirmEmailChange')
  .params('code')
  .schema({
    code: S.string(),
  })
  .fn(async code => {
    const changeEmail = await ChangeEmailRequestEntity.getByKeyOrNull({ code });
    if (!changeEmail) {
      throw new AppError('Invalid or used reset code');
    }
    if (changeEmail.expireAt < Date.now()) {
      throw new AppError('Expired code. Please request email change again.');
    }
    const user = await UserEntity.getById(changeEmail.userId);
    const updated = await updateEmailCUD(user, changeEmail.email);
    if (!updated.isVerified) {
      updated.isVerified = true;
      await updated.update(['isVerified']);
    }
    await changeEmail.delete();
    return _generateAuthData(updated);
  });

export const confirmEmailChangeRpc = createRpcBinding({
  public: true,
  signature: 'user.confirmEmailChange',
  handler: confirmEmailChange,
});
