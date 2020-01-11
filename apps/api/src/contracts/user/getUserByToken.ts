import { createContract } from '../../lib';
import { S } from 'schema';
import { createKey, getItem } from '../../common/db';
import { DbToken } from '../../types';
import { getDbUserById } from './getDbUserById';
import { mapDbUser } from '../../common/mapping';

export const getUserByToken = createContract('user.getUserByToken')
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

    const user = await getDbUserById(dbToken.userId);
    return mapDbUser(user);
  });
