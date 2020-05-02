import { Transaction } from '../orm/Transaction';
import { TABLE_NAME } from '../config';
import { ChallengeEntity } from '../entities';

export function updateChallengeStats(
  t: Transaction,
  challengeId: number,
  name: 'solutions' | 'solved' | 'submissions',
  add: number
) {
  t.updateRaw({
    tableName: TABLE_NAME,
    key: ChallengeEntity.createKey({ challengeId }),
    updateExpression: `SET stats.${name} = stats.${name} + :inc`,
    expressionValues: {
      ':inc': add,
    },
  });
}
