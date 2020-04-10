import * as R from 'remeda';
import { rethrowTransactionCanceled } from '../../common/helper';
import { SolutionEntity } from '../../entities';
import { createTransaction } from '../../lib';

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
  const t = createTransaction();
  t.insert(solutionSlug, {
    conditionExpression: 'attribute_not_exists(pk)',
  });
  t.insert(solution);
  await t
    .commit()
    .catch(rethrowTransactionCanceled('Duplicated slug for this challenge'));
  return solution;
}
