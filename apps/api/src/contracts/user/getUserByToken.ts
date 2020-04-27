import { createContract } from '../../lib';
import { S } from 'schema';
import { TokenCollection } from '../../collections/TokenModel';
import { UserCollection } from '../../collections/UserModel';
import { mapToUser } from '../../common/mapper';

export const getUserByToken = createContract('user.getUserByToken')
  .params('token')
  .schema({
    token: S.string(),
  })
  .fn(async token => {
    const tokenResult = await TokenCollection.findOne({
      _id: token,
    });
    if (!tokenResult) {
      return null;
    }
    const user = await UserCollection.findOneOrThrow({
      userId: tokenResult.userId,
    });
    return mapToUser(user);
  });
