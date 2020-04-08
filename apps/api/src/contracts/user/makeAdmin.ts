import { S } from 'schema';
import { createContract } from '../../lib';
import { AppError } from '../../common/errors';
import { UserEntity } from '../../entities2';

export const makeAdmin = createContract('user.makeAdmin')
  .params('userId')
  .schema({
    userId: S.string(),
  })
  .fn(async userId => {
    const user = await UserEntity.getByIdOrNull(userId);
    if (!user) {
      throw new AppError('user not found');
    }
    user.isAdmin = true;
    await user.update(['isAdmin']);
  });
