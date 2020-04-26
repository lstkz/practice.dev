import { S } from 'schema';
import uuid from 'uuid';
import { createContract } from '../../lib';
import { TokenCollection } from '../../collections/TokenModel';

export const createToken = createContract('user.createToken')
  .params('userId', 'fixedToken')
  .schema({
    userId: S.number(),
    fixedToken: S.string().nullable().optional(),
  })
  .fn(async (userId, fixedToken) => {
    const token = fixedToken || uuid();
    await TokenCollection.insertOne({
      _id: token,
      userId,
    });

    return token;
  });
