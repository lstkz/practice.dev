import { createContract } from '../../lib';
import { S } from 'schema';
import { AppError } from '../../common/errors';
import { createKey, getItem } from '../../common/db';
import { DbChallenge } from '../../types';

export const getDbChallengeById = createContract('challenge.getDbChallengeById')
  .params('id')
  .schema({
    id: S.number(),
  })
  .fn(async id => {
    const challengeKey = createKey({ type: 'CHALLENGE', id });
    const dbChallenge = await getItem<DbChallenge>(challengeKey);
    if (!dbChallenge) {
      throw new AppError(`Challenge "${id}" does not exist`);
    }
    return dbChallenge;
  });
