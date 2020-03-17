import { S } from 'schema';
import { createContract } from '../../lib';
import * as db from '../../common/db-next';
import { AppError } from '../../common/errors';
import * as userReader from '../../readers/userReader';

export const makeAdmin = createContract('user.makeAdmin')
  .params('userId')
  .schema({
    userId: S.string(),
  })
  .fn(async userId => {
    const user = await userReader.getById(userId);
    if (!user) {
      throw new AppError('user not found');
    }
    user.isAdmin = true;
    await db.update(user.prepareUpdate(['isAdmin']));
  });
