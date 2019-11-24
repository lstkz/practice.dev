import { S } from 'schema';
import { createContract } from '../../lib';
import { createKey, getItemEnsure, getItem } from '../../common/db';
import { DbUser, DbToken } from '../../types';

export const getDbUserByToken = createContract('user.getDbUserByToken')
  .params('token')
  .schema({
    token: S.string(),
  })
  .fn(async token => {
    const tokenKey = createKey({ type: 'TOKEN', token });
    const dbToken = await getItem<DbToken>(tokenKey);
    if (!dbToken) {
      return null;
    }
    const userKey = createKey({ type: 'USER', userId: dbToken.userId });
    return await getItemEnsure<DbUser>(userKey);
  });
