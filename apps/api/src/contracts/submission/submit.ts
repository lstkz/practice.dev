import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
import { urlRegex } from 'shared';
import { AppError } from '../../common/errors';
import { ChallengeEntity } from '../../entities';
import { _rateLimitSubmit } from './_rateLimitSubmit';
import { _completeSubmit } from './_completeSubmit';

export const submit = createContract('submission.submit')
  .params('userId', 'values')
  .schema({
    userId: S.string(),
    values: S.object().keys({
      challengeId: S.number(),
      testUrl: S.string().regex(urlRegex),
    }),
  })
  .fn(async (userId, values) => {
    const challenge = await ChallengeEntity.getByKeyOrNull({
      challengeId: values.challengeId,
    });
    if (!challenge) {
      throw new AppError('Challenge not found');
    }
    const id = await _completeSubmit(userId, {
      ...values,
      tests: challenge.testsBundleS3Key,
      testType: challenge.domain === 'backend' ? 'backend' : 'frontend',
      type: 'challenge',
    });
    return {
      id,
    };
  });

export const submitRpc = createRpcBinding({
  verified: true,
  injectUser: true,
  signature: 'challenge.submit',
  handler: submit,
});
