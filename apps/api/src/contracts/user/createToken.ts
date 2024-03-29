import { S } from 'schema';
import uuid from 'uuid';
import { createContract } from '../../lib';
import { TokenEntity } from '../../entities';

export const createToken = createContract('user.createToken')
  .params('userId', 'fixedToken')
  .schema({
    userId: S.string(),
    fixedToken: S.string()
      .nullable()
      .optional(),
  })
  .fn(async (userId, fixedToken) => {
    const token = new TokenEntity({
      userId,
      token: fixedToken || uuid(),
    });
    await token.insert();

    return token.token;
  });
