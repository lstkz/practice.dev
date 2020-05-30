import {
  SocketMessage,
  TestInfo,
  updateTestResult,
  SubmissionStatus,
} from 'shared';
import { Notifier } from '@pvd/tester';
import { updateSubmissionStatus } from '../contracts/submission/updateSubmissionStatus';
import { randomString } from 'remeda';
import { s3 } from '../lib';
import { S3_BUCKET_NAME } from '../config';

export class DbNotifier implements Notifier {
  private tests: TestInfo[] = null!;
  private result: 'PASS' | 'FAIL' = null!;

  constructor(private submissionId: string) {}

  async flush() {
    //
  }

  async notify(action: SocketMessage) {
    const state = {
      tests: this.tests,
      result: this.result,
    };
    updateTestResult(state, action);
    this.tests = state.tests;
    this.result = state.result;

    switch (action.type) {
      case 'TEST_INFO': {
        await updateSubmissionStatus(this.submissionId, {
          status: SubmissionStatus.Running,
        });
        break;
      }
      case 'RESULT': {
        const s3Key = `results/${randomString(25).toLowerCase()}.json`;
        await s3
          .upload({
            Bucket: S3_BUCKET_NAME,
            Key: s3Key,
            Body: JSON.stringify(this.tests),
            ContentType: 'application/json',
          })
          .promise();

        await updateSubmissionStatus(this.submissionId, {
          status:
            this.result === 'PASS'
              ? SubmissionStatus.Pass
              : SubmissionStatus.Fail,
          result: s3Key,
        });
        break;
      }
    }
  }
}
