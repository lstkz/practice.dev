import { S } from 'schema';
import * as R from 'remeda';
import { createContract, createRpcBinding } from '../../lib';
import * as db from '../../common/db-next';
import { safeAssign, safeKeys } from '../../common/helper';
import * as challengeReader from '../../readers/challengeReader';
import { ChallengeEntity } from '../../entities';

export const updateChallenge = createContract('challenge.updateChallenge')
  .params('values')
  .schema({
    values: S.object().keys({
      id: S.number(),
      title: S.string(),
      description: S.string(),
      detailsBundleS3Key: S.string(),
      testsBundleS3Key: S.string(),
      testCase: S.string(),
      domain: S.enum().literal('frontend', 'backend', 'fullstack', 'styling'),
      difficulty: S.enum().literal('easy', 'medium', 'hard'),
      tags: S.array().items(S.string()),
    }),
  })
  .fn(async values => {
    const challenge = await challengeReader.getChallengeByIdOrNull(values.id);
    const exactValues = R.omit(values, ['id']);
    if (challenge) {
      safeAssign(challenge, exactValues);
      await db.update(challenge.prepareUpdate(safeKeys(exactValues)));
    } else {
      await db.put(
        new ChallengeEntity({
          ...exactValues,
          challengeId: values.id,
          createdAt: Date.now(),
          stats: {
            likes: 0,
            solutions: 0,
            solved: 0,
            submissions: 0,
          },
        })
      );
    }
    return values.id;
  });

export const updateChallengeRpc = createRpcBinding({
  admin: true,
  signature: 'challenge.updateChallenge',
  handler: updateChallenge,
});
