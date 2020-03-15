import { Converter } from 'aws-sdk/clients/dynamodb';
import { createKey } from '../../common/db';

export interface CreateChallengeTagUpdate {
  tag: string;
  challengeId: number;
  inc: number;
}

export function createChallengeTagUpdate(options: CreateChallengeTagUpdate) {
  const tag = options.tag.toLowerCase();
  return {
    Key: Converter.marshall(
      createKey({
        type: 'CHALLENGE_TAG',
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
