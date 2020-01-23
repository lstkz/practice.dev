import {
  createContract,
  createRpcBinding,
  sns,
  getLoggedInUser,
} from '../../lib';
import { rateLimit } from '../misc/rateLimit';
import { getDuration } from '../../common/helper';
import { S } from 'schema';
import uuid from 'uuid';
import { SubmissionStatus, TesterMessage } from 'shared';
import { _putSubmission } from './_putSubmission';
import { getDbChallengeById } from '../challenge/getDbChallengeById';
import { createKey } from '../../common/db';
import { TESTER_TOPIC_ARN } from '../../config';

const RATE_LIMIT_PER_DAY = 1000;
const RATE_LIMIT_PER_HOUR = 100;

export const submit = createContract('submission.submit')
  .params('values')
  .schema({
    values: S.object().keys({
      challengeId: S.number(),
      testUrl: S.string().regex(
        /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?$/
      ),
    }),
  })
  .fn(async values => {
    const user = getLoggedInUser();
    const userId = user.userId;
    const challenge = await getDbChallengeById(values.challengeId);
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

    await _putSubmission(
      {
        ...createKey({ type: 'SUBMISSION', submissionId: id }),
        submissionId: id,
        challengeId: values.challengeId,
        userId,
        status: SubmissionStatus.Queued,
        data_n: Date.now(),
        testUrl: values.testUrl,
      },
      true
    );

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
  signature: 'challenge.submit',
  handler: submit,
});
