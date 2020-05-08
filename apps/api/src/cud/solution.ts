import {
  SolutionProps,
  SolutionEntity,
  SolutionTagStatsEntity,
  SolutionSlugEntity,
} from '../entities';
import * as R from 'remeda';
import { createTransaction } from '../lib';
import {
  rethrowTransactionCanceled,
  safeAssign,
  safeKeys,
} from '../common/helper';
import { Transaction } from '../orm/Transaction';
import { TABLE_NAME } from '../config';
import { updateUserStats } from './user';
import { updateChallengeStats } from './challenge';
import { AppError } from '../common/errors';

function _addTagStats(
  t: Transaction,
  challengeId: number,
  addTags: string[],
  removeTags: string[]
) {
  const tags = [
    ...addTags.map(tag => ({ tag, add: 1 })),
    ...removeTags.map(tag => ({ tag, add: -1 })),
  ];
  tags.forEach(({ tag, add }) => {
    t.updateRaw({
      tableName: TABLE_NAME,
      key: SolutionTagStatsEntity.createKey({
        challengeId,
        tag,
      }),
      updateExpression: [
        'SET #count = if_not_exists(#count, :zero) + :incr',
        'challengeId = :challengeId',
        'entityType = :entityType',
        '#tag = :tag',
      ].join(', '),
      expressionNames: {
        '#count': 'count',
        '#tag': 'tag',
      },
      expressionValues: {
        ':incr': add,
        ':zero': 0,
        ':challengeId': challengeId,
        ':tag': tag,
        ':entityType': SolutionTagStatsEntity.entityType,
      },
    });
  });
}

export async function createSolutionCUD(props: SolutionProps) {
  const solution = new SolutionEntity(props);
  const solutionSlug = new SolutionSlugEntity({
    solutionId: solution.solutionId,
    challengeId: props.challengeId,
    slug: props.slug,
  });
  const t = createTransaction();
  t.insert(solutionSlug, {
    conditionExpression: 'attribute_not_exists(pk)',
  });
  t.insert(solution);
  _addTagStats(t, solution.challengeId, solution.tags, []);
  updateUserStats(t, solution.userId, 'solutions', 1);
  updateChallengeStats(t, solution.challengeId, 'solutions', 1);
  await t
    .commit()
    .catch(rethrowTransactionCanceled('Duplicated slug for this challenge'));
  return solution;
}

export async function removeSolutionCUD(solution: SolutionEntity) {
  const solutionSlug = new SolutionSlugEntity({
    solutionId: solution.solutionId,
    challengeId: solution.challengeId,
    slug: solution.slug,
  });
  const t = createTransaction();
  t.delete(solutionSlug, {
    conditionExpression: 'attribute_exists(pk)',
  });
  t.delete(solution);
  _addTagStats(t, solution.challengeId, [], solution.tags);
  updateUserStats(t, solution.userId, 'solutions', -1);
  updateChallengeStats(t, solution.challengeId, 'solutions', -1);
  await t.commit();
  return solution;
}

export async function updateSolutionCUD(
  solution: SolutionEntity,
  newProps: SolutionProps
) {
  const currentVersion = solution.version!;
  const t = createTransaction();
  const removedTags = R.difference(solution.tags, newProps.tags);
  const newTags = R.difference(newProps.tags, solution.tags);
  _addTagStats(t, solution.challengeId, newTags, removedTags);
  if (solution.slug !== newProps.slug) {
    const existing = await SolutionSlugEntity.getByKeyOrNull({
      slug: newProps.slug,
      challengeId: newProps.challengeId,
    });
    if (existing) {
      throw new AppError('Duplicated slug for this challenge');
    }
    const newSlug = new SolutionSlugEntity({
      solutionId: solution.solutionId,
      challengeId: newProps.challengeId,
      slug: newProps.slug,
    });
    const oldSlug = new SolutionSlugEntity({
      solutionId: solution.solutionId,
      challengeId: newProps.challengeId,
      slug: solution.slug,
    });
    t.insert(newSlug, {
      conditionExpression: 'attribute_not_exists(pk)',
    });
    t.delete(oldSlug, {
      conditionExpression: 'attribute_exists(pk)',
    });
  }
  safeAssign(solution, newProps);
  solution.version = currentVersion + 1;
  t.update(solution, safeKeys(newProps), {
    conditionExpression: 'version = :currentVersion',
    expressionValues: {
      ':currentVersion': currentVersion,
    },
  });
  await t.commit().catch(rethrowTransactionCanceled());
  return solution;
}
