import { Converter } from 'aws-sdk/clients/dynamodb';
import { createKey } from '../../common/db';

export interface CreateSolutionTagUpdate {
  tag: string;
  challengeId: number;
  inc: number;
}

export function createSolutionTagUpdate(options: CreateSolutionTagUpdate) {
  const tag = options.tag.toLowerCase();
  return {
    Key: Converter.marshall(
      createKey({
        type: 'GLOBAL_SOLUTION_TAG',
        challengeId: options.challengeId,
        tag,
      })
    ),
    UpdateExpression: [
      'SET #count = if_not_exists(#count, :zero) + :incr',
      'challengeId = :challengeId',
      '#data = :tag',
    ].join(', '),
    ExpressionAttributeNames: {
      '#count': 'count',
      '#data': 'data',
    },
    ExpressionAttributeValues: Converter.marshall({
      ':incr': options.inc,
      ':zero': 0,
      ':challengeId': options.challengeId,
      ':tag': tag,
    }),
  };
}
