import { createContract, createRpcBinding, sns } from '../../lib';
import { rateLimit } from '../misc/rateLimit';
import { getDuration } from '../../common/helper';
import { S } from 'schema';
import uuid from 'uuid';
import { SubmissionStatus, TesterMessage } from 'shared';
import { TESTER_TOPIC_ARN } from '../../config';
import { AppError } from '../../common/errors';
import { ChallengeEntity } from '../../entities';
import { createSubmissionCUD } from '../../cud/submission';

const RATE_LIMIT_PER_DAY = 1000;
const RATE_LIMIT_PER_HOUR = 100;

export const submit = createContract('submission.submit')
  .params('userId', 'values')
  .schema({
    userId: S.string(),
    values: S.object().keys({
      challengeId: S.number(),
      testUrl: S.string().regex(
        /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%_\+.~#?&//=]{1,256}\.[a-z]{1,10}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?$/
      ),
    }),
  })
  .fn(async (userId, values) => {
    const challenge = await ChallengeEntity.getByKeyOrNull({
      challengeId: values.challengeId,
    });
    if (!challenge) {
      throw new AppError('Challenge not found');
    }

    await Promise.all([
      rateLimit(
        `SUBMIT_days:${userId}`,
        getDuration(1, 'd'),
        RATE_LIMIT_PER_DAY
      ),
      rateLimit(
        `SUBMIT_hours:${userId}`,
        getDuration(1, 'h'),
        RATE_LIMIT_PER_HOUR
      ),
    ]);
    const id = uuid();
    const submission = await createSubmissionCUD({
      submissionId: id,
      challengeId: values.challengeId,
      userId,
      status: SubmissionStatus.Queued,
      createdAt: Date.now(),
      testUrl: values.testUrl,
    });
    await submission.insert();
    const testerMessage: TesterMessage = {
      id,
      challengeId: values.challengeId,
      testUrl: values.testUrl,
      userId,
      tests: challenge.testsBundleS3Key,
      type: challenge.domain === 'backend' ? 'backend' : 'frontend',
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
  injectUser: true,
  signature: 'challenge.submit',
  handler: submit,
});
