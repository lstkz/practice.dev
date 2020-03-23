import * as R from 'remeda';
import { rethrowTransactionCanceled } from '../../common/helper';
import { SolutionEntity } from '../../entities';
import { transactWriteItems } from '../../common/db-next';

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
  const props = {
    ...R.omit(values, ['id']),
    solutionId: values.id,
  };
  const solution = new SolutionEntity(props);
  const solutionSlug = new SolutionEntity(props, { type: 'slug' });

  await transactWriteItems([
    {
      Put: {
        ...solutionSlug.preparePut(),
        ConditionExpression: 'attribute_not_exists(pk)',
      },
    },
    {
      Put: solution.preparePut(),
    },
  ]).catch(rethrowTransactionCanceled('Duplicated slug for this challenge'));

  return solution;
}
