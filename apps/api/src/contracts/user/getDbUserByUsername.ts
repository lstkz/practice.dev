import { S } from 'schema';
import { createContract } from '../../lib';
import { createKey, getItemEnsure } from '../../common/db';
import { DbUser } from '../../types';

export const getDbUserByUsername = createContract('user.getDbUserByUsername')
  .params('username')
  .schema({
    username: S.string(),
  })
  .fn(async username => {
    const userKey = createKey({ type: 'USER_USERNAME', username });
    return await getItemEnsure<DbUser>(userKey);
  });
