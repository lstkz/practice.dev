import { createContract, createRpcBinding } from '../../lib';
import * as R from 'remeda';
import { S } from 'schema';
import { _createSolution } from './_createSolution';
import { solutionUserInput } from './_solutionSchema';
import { getDbUserById } from '../user/getDbUserById';
import { getDbSolutionById } from './getDbSolutionById';
import {
  normalizeTags,
  rethrowTransactionCanceled,
  assertAuthorOrAdmin,
} from '../../common/helper';
import {
  transactWriteItems,
  createKey,
  TransactWriteItems,
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

    const newTags = R.difference(values.tags, dbSolution.tags);
    const removedTags = R.difference(dbSolution.tags, values.tags);
    const updated: DbSolution = {
      ...dbSolution,
      ...values,
    };
    updated.v++;

    const transactOptions: TransactWriteItems = {
      deleteItems: [],
      updateItems: [],
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
    transactOptions.conditionalPutItems.push({
      expression: 'v = :v',
      values: {
        ':v': dbSolution.v,
      },
      item: updated,
    });

    const solutionUserKey = createKey({
      type: 'SOLUTION_USER',
      solutionId: dbSolution.solutionId,
      userId: dbSolution.userId,
    });

    const solutionChallengeUserKey = createKey({
      type: 'SOLUTION_CHALLENGE_USER',
      solutionId: dbSolution.solutionId,
      challengeId: dbSolution.challengeId,
      userId: dbSolution.userId,
    });

    transactOptions.putItems.push(
      {
        ...updated,
        ...solutionUserKey,
      },
      {
        ...updated,
        ...solutionChallengeUserKey,
      },
      ...newTags.map(tag => ({
        ...dbSolution,
        ...createKey({
          type: 'SOLUTION_TAG',
          challengeId: dbSolution.challengeId,
          solutionId: dbSolution.solutionId,
          tag,
        }),
      }))
    );
    transactOptions.deleteItems.push(
      ...removedTags.map(tag =>
        createKey({
          type: 'SOLUTION_TAG',
          challengeId: dbSolution.challengeId,
          solutionId: dbSolution.solutionId,
          tag,
        })
      )
    );

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
