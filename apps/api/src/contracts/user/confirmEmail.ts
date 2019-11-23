import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import {
  createKey,
  getItem,
  transactWriteItems,
  prepareUpdate,
} from '../../common/db';
import { AppError } from '../../common/errors';
import { getDbUserById } from './getDbUserById';
import { DbConfirmCode } from '../../types';
import { _generateAuthData } from './_generateAuthData';

export const confirmEmail = createContract('user.confirmEmail')
  .params('code')
  .schema({
    code: S.string(),
  })
  .fn(async code => {
    const confirmKey = createKey({ type: 'CONFIRM_CODE', code });
    const item = await getItem<DbConfirmCode>(confirmKey);
    if (!item) {
      throw new AppError('Invalid code');
    }
    const dbUser = await getDbUserById(item.userId);
    dbUser.isVerified = true;

    await transactWriteItems({
      deleteItems: [confirmKey],
      updateItems: [prepareUpdate(dbUser, ['isVerified'])],
    });

    return _generateAuthData(dbUser);
  });

export const confirmEmailRpc = createRpcBinding({
  public: true,
  signature: 'user.confirmEmail',
  handler: confirmEmail,
});
