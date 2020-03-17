import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
import { _createSolution } from './_createSolution';
import { solutionUserInput } from './_solutionSchema';
// import { getDbUserById } from '../user/getDbUserById';
import { getDbSolutionById } from './getDbSolutionById';
import {
  normalizeTags,
  rethrowTransactionCanceled,
  assertAuthorOrAdmin,
  safeKeys,
} from '../../common/helper';
import {
  transactWriteItems,
  createKey,
  TransactWriteItems,
  prepareUpdate,
} from '../../common/db';
import { DbSolution } from '../../types';
import { mapDbSolution } from '../../common/mapping';

export const updateSolution = createContract('solution.updateSolution')
  .params('userId', 'solutionId', 'values')
  .schema({
    userId: S.string(),
    solutionId: S.string(),
    values: S.object().keys(solutionUserInput),
  })
  .fn(async (userId, solutionId, values) => {
    const [user, dbSolution] = await Promise.all([
      getDbUserById(userId),
      getDbSolutionById(solutionId, true),
    ]);
    assertAuthorOrAdmin(dbSolution, user);
    values.tags = normalizeTags(values.tags);

    const updated: DbSolution = {
      ...dbSolution,
      ...values,
    };

    const transactOptions: TransactWriteItems = {
      deleteItems: [],
      updateItems: [prepareUpdate(updated, safeKeys(solutionUserInput))],
      putItems: [],
      conditionalPutItems: [],
      conditionalDeleteItems: [],
    };

    if (dbSolution.slug !== values.slug) {
      transactOptions.deleteItems.push(
        createKey({
          type: 'SOLUTION_SLUG',
          challengeId: dbSolution.challengeId,
          slug: dbSolution.slug,
        })
      );
      const solutionSlugKey = createKey({
        type: 'SOLUTION_SLUG',
        challengeId: dbSolution.challengeId,
        slug: values.slug,
      });
      transactOptions.conditionalPutItems.push({
        expression: 'attribute_not_exists(pk)',
        item: { ...updated, ...solutionSlugKey },
      });
    }

    const [solutionAuthor] = await Promise.all([
      getDbUserById(updated.userId),
      transactWriteItems(transactOptions).catch(
        rethrowTransactionCanceled('Duplicated slug for this challenge')
      ),
    ]);
    return mapDbSolution(updated, solutionAuthor);
  });

export const updateSolutionRpc = createRpcBinding({
  injectUser: true,
  signature: 'solution.updateSolution',
  handler: updateSolution,
});
