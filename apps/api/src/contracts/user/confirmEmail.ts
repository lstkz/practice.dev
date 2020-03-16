import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { AppError } from '../../common/errors';
import * as db from '../../common/db-next';
import { ConfirmCodeEntity, UserEntity } from '../../entities';
import { _generateAuthData } from './_generateAuthData';

export const confirmEmail = createContract('user.confirmEmail')
  .params('code')
  .schema({
    code: S.string(),
  })
  .fn(async code => {
    const confirmCode = await db.getOrNull(ConfirmCodeEntity, {
      code,
    });
    if (!confirmCode) {
      throw new AppError('Invalid code');
    }
    const user = await db.get(UserEntity, {
      userId: confirmCode.userId,
    });
    user.isVerified = true;
    await db.transactWriteItems([
      {
        Delete: confirmCode.prepareDelete(),
      },
      {
        Update: user.prepareUpdate(['isVerified']),
      },
    ]);
    return _generateAuthData(user);
  });

export const confirmEmailRpc = createRpcBinding({
  public: true,
  signature: 'user.confirmEmail',
  handler: confirmEmail,
});
