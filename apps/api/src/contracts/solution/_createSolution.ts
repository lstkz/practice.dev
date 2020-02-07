import * as R from 'remeda';
import { createKey, transactWriteItems } from '../../common/db';
import { DbSolution } from '../../types';
import { createStatsUpdate } from '../challenge/createStatsUpdate';
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

  const solutionUserKey = createKey({
    type: 'SOLUTION_USER',
    solutionId: values.id,
    userId: values.userId,
  });

  const solutionChallengeUserKey = createKey({
    type: 'SOLUTION_CHALLENGE_USER',
    solutionId: values.id,
    challengeId: values.challengeId,
    userId: values.userId,
  });

  const dbSolution: DbSolution = {
    ...solutionKey,
    ...R.omit(values, ['createdAt', 'likes', 'id']),
    v: 1,
    data_n: values.createdAt,
    data2_n: values.likes,
    solutionId: values.id,
  };

  await transactWriteItems({
    conditionalPutItems: [
      {
        expression: 'attribute_not_exists(pk)',
        item: solutionSlugKey,
      },
    ],
    putItems: [
      dbSolution,
      {
        ...dbSolution,
        ...solutionUserKey,
      },
      {
        ...dbSolution,
        ...solutionChallengeUserKey,
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
  }).catch(rethrowTransactionCanceled('Duplicated slug for this challenge'));

  return dbSolution;
}
