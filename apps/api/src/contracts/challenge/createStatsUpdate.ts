import { TABLE_NAME } from '../../lib';
import { ChallengeStats } from 'shared';
import { createKey } from '../../common/db';
import { Converter } from 'aws-sdk/clients/dynamodb';

export function createStatsUpdate(
  challengeId: number,
  name: keyof ChallengeStats,
  add: number
) {
  const key = createKey({ type: 'CHALLENGE', id: challengeId });
  return {
    TableName: TABLE_NAME,
    Key: Converter.marshall(key),
    UpdateExpression: `SET stats.${name} = stats.${name} + :inc`,
    ExpressionAttributeValues: Converter.marshall({
      ':inc': add,
    }),
  };
}
