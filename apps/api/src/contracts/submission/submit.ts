import { createContract, createRpcBinding, sns } from '../../lib';
import * as R from 'remeda';
import { S } from 'schema';
import { urlRegex, SubmissionStatus, TesterMessage } from 'shared';
import uuid from 'uuid';
import { createSubmissionCUD } from '../../cud/submission';
import { TESTER_TOPIC_ARN } from '../../config';
import { getChallengeOrProjectChallenge } from '../../common/baseChallenge';
import { rateLimit } from '../misc/rateLimit';
import { getDuration } from '../../common/helper';

const RATE_LIMIT_PER_DAY = 1000;
const RATE_LIMIT_PER_HOUR = 100;

export async function _rateLimitSubmit(userId: string) {
  await Promise.all([
    rateLimit(`SUBMIT_days:${userId}`, getDuration(1, 'd'), RATE_LIMIT_PER_DAY),
    rateLimit(
      `SUBMIT_hours:${userId}`,
      getDuration(1, 'h'),
      RATE_LIMIT_PER_HOUR
    ),
  ]);
}

export const submit = createContract('submission.submit')
  .params('userId', 'values')
  .schema({
    userId: S.string(),
    values: S.object().keys({
      challengeId: S.number(),
      projectId: S.number().optional(),
      testUrl: S.string().regex(urlRegex),
    }),
  })
  .fn(async (userId, values) => {
    const baseChallenge = await getChallengeOrProjectChallenge(
      userId,
      R.pick(values, ['challengeId', 'projectId'])
    );
    await _rateLimitSubmit(userId);
    const id = uuid();
    const submission = await createSubmissionCUD({
      submissionId: id,
      projectId: values.projectId,
      challengeId: values.challengeId,
      userId,
      status: SubmissionStatus.Queued,
      createdAt: Date.now(),
      testUrl: values.testUrl,
      type: values.projectId == null ? 'challenge' : 'project',
    });
    await submission.insert();
    const testerMessage: TesterMessage = {
      id,
      testUrl: values.testUrl,
      userId,
      tests: baseChallenge.testsBundleS3Key,
      type: baseChallenge.domain === 'backend' ? 'backend' : 'frontend',
    };
    await sns
      .publish({
        TopicArn: TESTER_TOPIC_ARN,
        Message: JSON.stringify(testerMessage),
      })
      .promise();
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
