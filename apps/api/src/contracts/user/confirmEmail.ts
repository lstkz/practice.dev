import { S } from 'schema';
import { createContract, createRpcBinding, createTransaction } from '../../lib';
import { AppError } from '../../common/errors';
import { _generateAuthData } from './_generateAuthData';
import { ConfirmCodeEntity, UserEntity } from '../../entities';

export const confirmEmail = createContract('user.confirmEmail')
  .params('code')
  .schema({
    code: S.string(),
  })
  .fn(async code => {
    const confirmCode = await ConfirmCodeEntity.getByKeyOrNull({ code });
    if (!confirmCode) {
      throw new AppError('Invalid code');
    }
    const user = await UserEntity.getByKey({ userId: confirmCode.userId });
    user.isVerified = true;
    const t = createTransaction();
    t.update(user, ['isVerified']);
    t.delete(confirmCode);
    await t.commit();

    return _generateAuthData(user);
  });

export const confirmEmailRpc = createRpcBinding({
  public: true,
  signature: 'user.confirmEmail',
  handler: confirmEmail,
});
