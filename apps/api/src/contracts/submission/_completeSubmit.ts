import { rateLimit } from '../misc/rateLimit';
import { getDuration } from '../../common/helper';
import uuid from 'uuid';
import { createSubmissionCUD } from '../../cud/submission';
import { TESTER_TOPIC_ARN } from '../../config';
import { SubmissionStatus, TesterMessage, SubmissionType } from 'shared';
import { sns } from '../../lib';

const RATE_LIMIT_PER_DAY = 1000;
const RATE_LIMIT_PER_HOUR = 100;

async function _rateLimitSubmit(userId: string) {
  await Promise.all([
    rateLimit(`SUBMIT_days:${userId}`, getDuration(1, 'd'), RATE_LIMIT_PER_DAY),
    rateLimit(
      `SUBMIT_hours:${userId}`,
      getDuration(1, 'h'),
      RATE_LIMIT_PER_HOUR
    ),
  ]);
}

interface CompleteSubmitValues {
  challengeId: number;
  projectId?: number;
  tests: string;
  testUrl: string;
  type: SubmissionType;
  testType: 'backend' | 'frontend';
}

export async function _completeSubmit(
  userId: string,
  values: CompleteSubmitValues
) {
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
    type: values.type,
  });
  await submission.insert();
  const testerMessage: TesterMessage = {
    id,
    testUrl: values.testUrl,
    userId,
    tests: values.tests,
    type: values.testType,
  };
  await sns
    .publish({
      TopicArn: TESTER_TOPIC_ARN,
      Message: JSON.stringify(testerMessage),
    })
    .promise();

  return id;
}
