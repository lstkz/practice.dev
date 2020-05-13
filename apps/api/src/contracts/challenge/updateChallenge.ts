import { S } from 'schema';
import * as R from 'remeda';
import { createContract, createRpcBinding } from '../../lib';
import { safeAssign, safeKeys } from '../../common/helper';
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
      assets: S.object().unknown().optional().nullable(),
    }),
  })
  .fn(async values => {
    if (!values.assets) {
      values.assets = null;
    }
    const challenge = await ChallengeEntity.getByKeyOrNull({
      challengeId: values.id,
    });
    const exactValues = R.omit(values, ['id']);
    if (challenge) {
      safeAssign(challenge, exactValues);
      await challenge.update(safeKeys(exactValues));
    } else {
      const newChallenge = new ChallengeEntity({
        ...exactValues,
        challengeId: values.id,
        createdAt: Date.now(),
        stats: {
          likes: 0,
          solutions: 0,
          solved: 0,
          submissions: 0,
        },
      });
      await newChallenge.insert();
    }
    return values.id;
  });

export const updateChallengeRpc = createRpcBinding({
  admin: true,
  signature: 'challenge.updateChallenge',
  handler: updateChallenge,
});
