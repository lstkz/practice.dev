import { createContract } from '../../lib';
import { S } from 'schema';
import { TokenEntity, UserEntity } from '../../entities';

export const getUserByToken = createContract('user.getUserByToken')
  .params('token')
  .schema({
    token: S.string(),
  })
  .fn(async token => {
    const tokenEntity = await TokenEntity.getByKeyOrNull({ token });
    if (!tokenEntity) {
      return null;
    }
    const user = await UserEntity.getByKey({ userId: tokenEntity.userId });
    return user.toUser();
  });
