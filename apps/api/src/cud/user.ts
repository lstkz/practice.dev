import { Transaction } from '../orm/Transaction';
import { TABLE_NAME } from '../config';
import { UserEntity, UserStats } from '../entities';

export function updateUserStats(
  t: Transaction,
  userId: string,
  name: keyof UserStats,
  add: number
) {
  t.updateRaw({
    tableName: TABLE_NAME,
    key: UserEntity.createKey({ userId }),
    updateExpression: `SET stats.${name} = if_not_exists(stats.${name}, :zero) + :inc`,
    expressionValues: {
      ':inc': add,
      ':zero': 0,
    },
  });
}
