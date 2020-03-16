import { createContract } from '../../lib';
import { S } from 'schema';
import { TokenEntity, UserEntity } from '../../entities';
import * as db from '../../common/db-next';

export const getUserByToken = createContract('user.getUserByToken')
  .params('token')
  .schema({
    token: S.string(),
  })
  .fn(async token => {
    const tokenEntity = await db.getOrNull(TokenEntity, {
      token,
    });
    if (!tokenEntity) {
      return null;
    }
    const user = await db.get(UserEntity, {
      userId: tokenEntity.userId,
    });
    return user.toUser();
  });
