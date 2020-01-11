import { S } from 'schema';
import * as R from 'remeda';
import { createContract, createRpcBinding } from '../../lib';
import { createKey, getItem, updateItem, putItems } from '../../common/db';
import { DbChallenge } from '../../types';
import { safeAssign, safeKeys } from '../../common/helper';

export const updateChallenge = createContract('challenge.updateChallenge')
  .params('values')
  .schema({
    values: S.object().keys({
      id: S.number(),
      title: S.string(),
      description: S.string(),
      bundle: S.string(),
      tests: S.string(),
      domain: S.enum().literal('frontend', 'backend', 'fullstack', 'styling'),
      difficulty: S.enum().literal('easy', 'medium', 'hard'),
      tags: S.array().items(S.string()),
    }),
  })
  .fn(async values => {
    const challengeKey = createKey({ type: `CHALLENGE`, id: values.id });
    let dbChallenge = await getItem<DbChallenge>(challengeKey);
    const exactValues = R.omit(values, ['id']);
    if (dbChallenge) {
      safeAssign(dbChallenge, exactValues);
      await updateItem(dbChallenge, safeKeys(exactValues));
    } else {
      dbChallenge = {
        ...challengeKey,
        data_n: values.id,
        ...exactValues,
        createdAt: Date.now(),
        stats: {
          likes: 0,
          solutions: 0,
          solved: 0,
          submissions: 0,
        },
      };
      await putItems(dbChallenge);
    }

    return values.id;
  });

export const updateChallengeRpc = createRpcBinding({
  admin: true,
  signature: 'challenge.updateChallenge',
  handler: updateChallenge,
});
