import * as R from 'remeda';
import { createKey, transactWriteItems } from '../../common/db';
import { DbSolution } from '../../types';
import { rethrowTransactionCanceled } from '../../common/helper';

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
    challengeId: values.challengeId,
    solutionId: values.id,
  });

  const solutionSlugKey = createKey({
    type: 'SOLUTION_SLUG',
    challengeId: values.challengeId,
    slug: values.slug,
  });

  const dbSolution: DbSolution = {
    ...solutionKey,
    ...R.omit(values, ['createdAt', 'likes', 'id']),
    data_n: values.createdAt,
    data2_n: values.likes,
    solutionId: values.id,
  };

  await transactWriteItems({
    conditionalPutItems: [
      {
        expression: 'attribute_not_exists(pk)',
        item: {
          ...dbSolution,
          ...solutionSlugKey,
        },
      },
    ],
    putItems: [dbSolution],
  }).catch(rethrowTransactionCanceled('Duplicated slug for this challenge'));

  return dbSolution;
}
