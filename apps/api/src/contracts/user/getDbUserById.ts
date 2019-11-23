import { S } from 'schema';
import { AppError } from '../../common/errors';
import { createContract } from '../../lib';
import { createKey, getItemEnsure } from '../../common/db';
import { DbUser } from '../../types';

export const getDbUserById = createContract('user.getDbUserById')
  .params('userId')
  .schema({
    userId: S.string(),
  })
  .fn(async userId => {
    const userKey = createKey({ type: 'USER', userId });
    return await getItemEnsure<DbUser>(userKey);
  });
