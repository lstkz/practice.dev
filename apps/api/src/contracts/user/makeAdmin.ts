import { S } from 'schema';
import { createContract } from '../../lib';
import { getDbUserById } from './getDbUserById';
import { updateItem } from '../../common/db';

export const makeAdmin = createContract('user.makeAdmin')
  .params('userId')
  .schema({
    userId: S.string(),
  })
  .fn(async userId => {
    const dbUser = await getDbUserById(userId);
    dbUser.isAdmin = true;
    await updateItem(dbUser, ['isAdmin']);
  });
