import { S } from 'schema';
import uuid from 'uuid';
import { createContract } from '../../lib';
import { createKey, putItems } from '../../common/db';
import { DbToken } from '../../types';

export const createToken = createContract('user.createToken')
  .params('userId', 'fixedToken')
  .schema({
    userId: S.string(),
    fixedToken: S.string()
      .nullable()
      .optional(),
  })
  .fn(async (userId, fixedToken) => {
    const token = fixedToken || uuid();
    const tokenKey = createKey({ type: 'TOKEN', token });
    const dbToken: DbToken = {
      ...tokenKey,
      userId,
    };
    await putItems(dbToken);

    return token;
  });
