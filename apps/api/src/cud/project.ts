import { Transaction } from '../orm/Transaction';
import { TABLE_NAME } from '../config';
import { ProjectEntity } from '../entities';

export function updateProjectStats(
  t: Transaction,
  projectId: number,
  challengeId: number,
  name: 'solved' | 'submissions',
  add: number
) {
  t.updateRaw({
    tableName: TABLE_NAME,
    key: ProjectEntity.createKey({ projectId }),
    updateExpression: `SET stats.${name}_${challengeId} = if_not_exists(stats.${name}_${challengeId}, :zero) + :inc`,
    expressionValues: {
      ':inc': add,
      ':zero': 0,
    },
  });
}
