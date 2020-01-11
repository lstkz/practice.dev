import * as R from 'remeda';
import { AppError } from '../../common/errors';
import { createKey, transactWriteItems } from '../../common/db';
import { DbSolution } from '../../types';
import { createStatsUpdate } from '../challenge/createStatsUpdate';
import { mapDbSolution } from '../../common/mapping';

interface CreateSolutionValues {
  createdAt: number;
  likes: number;
  id: string;
  title: string;
  slug: string;
  url: string;
  description?: string;
  tags: string[];
  userId: string;
  challengeId: number;
}

export async function _createSolution(values: CreateSolutionValues) {
  const solutionKey = createKey({
    type: 'SOLUTION',
    solutionId: values.id,
    challengeId: values.challengeId,
    slug: values.slug,
  });

  const solutionUserKey = createKey({
    type: 'SOLUTION_USER',
    solutionId: values.id,
    challengeId: values.challengeId,
    userId: values.userId,
  });

  const dbSolution: DbSolution = {
    ...solutionKey,
    ...R.omit(values, ['createdAt', 'likes', 'id']),
    data_n: values.createdAt,
    data2_n: values.likes,
    solutionId: values.id,
  };

  try {
    await transactWriteItems({
      conditionalPutItems: [
        {
          expression: 'attribute_not_exists(pk)',
          item: dbSolution,
        },
      ],
      putItems: [
        {
          ...dbSolution,
          ...solutionUserKey,
        },
        ...values.tags.map(tag => ({
          ...dbSolution,
          ...createKey({
            type: 'SOLUTION_TAG',
            challengeId: values.challengeId,
            solutionId: values.id,
            tag,
          }),
        })),
      ],
      updateItems: [createStatsUpdate(values.challengeId, 'solutions', 1)],
    });
  } catch (e) {
    if (e.code === 'TransactionCanceledException') {
      throw new AppError('Duplicated slug for this challenge');
    }

    throw e;
  }

  return dbSolution;
}
