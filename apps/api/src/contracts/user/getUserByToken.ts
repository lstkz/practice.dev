import { createContract } from '../../lib';
import { S } from 'schema';
import * as userReader from '../../readers/userReader';

export const getUserByToken = createContract('user.getUserByToken')
  .params('token')
  .schema({
    token: S.string(),
  })
  .fn(async token => {
    const user = await userReader.getByTokenOrNull(token);
    if (!user) {
      return null;
    }
    return user.toUser();
  });
