import {
  SolutionVoteProps,
  SolutionVoteEntity,
  SolutionEntity,
} from '../entities';
import { createTransaction } from '../lib';
import { Transaction } from '../orm/Transaction';
import { TABLE_NAME } from '../config';

export function updateSolutionVoteStats(
  t: Transaction,
  solutionId: string,
  add: number
) {
  t.updateRaw({
    tableName: TABLE_NAME,
    key: SolutionEntity.createKey({ solutionId }),
    updateExpression: `SET likes = likes + :inc`,
    expressionValues: {
      ':inc': add,
    },
  });
}

export async function createSolutionVoteCUD(props: SolutionVoteProps) {
  const vote = new SolutionVoteEntity(props);
  const t = createTransaction();
  await t.insert(vote, {
    conditionExpression: 'attribute_not_exists(pk)',
  });
  updateSolutionVoteStats(t, props.solutionId, 1);
  await t.commit();
}

export async function removeSolutionVoteCUD(props: SolutionVoteProps) {
  const vote = new SolutionVoteEntity(props);
  const t = createTransaction();
  await t.delete(vote, {
    conditionExpression: 'attribute_exists(pk)',
  });
  updateSolutionVoteStats(t, props.solutionId, -1);
  await t.commit();
}
