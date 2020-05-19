import { createContract } from '../../lib';
import { S } from 'schema';
import { SubmissionStatus } from 'shared';
import { SubmissionEntity } from '../../entities';
import { AppError, UnreachableCaseError } from '../../common/errors';
import { createChallengeSolvedCUD } from '../../cud/challengeSolved';
import { createProjectChallengeSolvedCUD } from '../../cud/projectChallengeSolved';

export const updateSubmissionStatus = createContract(
  'submission.updateSubmissionStatus'
)
  .params('submissionId', 'values')
  .schema({
    submissionId: S.string(),
    values: S.object().keys({
      status: S.enum().values<SubmissionStatus>(
        Object.values(SubmissionStatus)
      ),
      result: S.string().optional(),
    }),
  })
  .fn(async (submissionId, values) => {
    const submission = await SubmissionEntity.getByKeyOrNull({ submissionId });
    if (!submission) {
      throw new AppError('Submission not found');
    }
    submission.status = values.status;
    submission.result = values.result;
    await submission.update(['status', 'result']);

    if (values.status === SubmissionStatus.Pass) {
      switch (submission.type) {
        case 'challenge':
          await createChallengeSolvedCUD(
            {
              challengeId: submission.challengeId,
              userId: submission.userId,
              solvedAt: Date.now(),
            },
            {
              ignoreTransactionCanceled: true,
            }
          );
          break;
        case 'project':
          await createProjectChallengeSolvedCUD(
            {
              projectId: submission.projectId!,
              challengeId: submission.challengeId,
              userId: submission.userId,
              solvedAt: Date.now(),
            },
            {
              ignoreTransactionCanceled: true,
            }
          );
          break;
        default:
          throw new UnreachableCaseError(submission.type);
      }
    }
  });
