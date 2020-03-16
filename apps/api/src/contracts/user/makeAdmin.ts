import { S } from 'schema';
import { createContract } from '../../lib';
import * as db from '../../common/db-next';
import { UserEntity } from '../../entities';
import { AppError } from '../../common/errors';

export const makeAdmin = createContract('user.makeAdmin')
  .params('userId')
  .schema({
    userId: S.string(),
  })
  .fn(async userId => {
    const user = await db.getOrNull(UserEntity, {
      userId,
    });
    if (!user) {
      throw new AppError('user not found');
    }
    user.isAdmin = true;
    await db.update(user.prepareUpdate(['isAdmin']));
  });
