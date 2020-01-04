import { createContract } from '../../lib';
import { S } from 'schema';
import { createKey, getItem } from '../../common/db';
import { DbSubmission } from '../../types';
import { AppError } from '../../common/errors';

export const getDbSubmissionById = createContract(
  'submission.getDbSubmissionById'
)
  .params('id')
  .schema({
    id: S.string(),
  })
  .fn(async id => {
    const key = createKey({
      type: 'SUBMISSION',
      submissionId: id,
    });
    const submission = await getItem<DbSubmission>(key);

    if (!submission) {
      throw new AppError(`Submission "${id}" does not exist`);
    }
    return submission;
  });
