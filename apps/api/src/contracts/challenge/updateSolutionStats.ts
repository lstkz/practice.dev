import { createContract, createDynamoStreamBinding } from '../../lib';
import { S } from 'schema';
import { Converter } from 'aws-sdk/clients/dynamodb';
import { ignoreTransactionCanceled } from '../../common/helper';
import {
  SolutionEntity,
  ChallengeSolvedEntity,
  ChallengeEntity,
} from '../../entities';
import { transactWriteItems } from '../../common/db-next';
import { EventEntity } from '../../entities/EventEntity';
import { TABLE_NAME } from '../../config';

export const updateChallengeStats = createContract(
  'challenge.updateChallengeStats'
)
  .params('eventId', 'challengeId', 'name', 'add')
  .schema({
    eventId: S.string(),
    challengeId: S.number(),
    name: S.enum().literal('solutions', 'solved', 'submissions'),
    add: S.number(),
  })
  .fn(async (eventId, challengeId, name, add) => {
    await transactWriteItems([
      {
        Put: EventEntity.getEventConditionPutItem(eventId),
      },
      {
        Update: {
          TableName: TABLE_NAME,
          Key: Converter.marshall(ChallengeEntity.createKey({ challengeId })),
          UpdateExpression: `SET stats.${name} = stats.${name} + :inc`,
          ExpressionAttributeValues: Converter.marshall({
            ':inc': add,
          }),
        },
      },
    ]).catch(ignoreTransactionCanceled());
  });

export const handleSolution = createDynamoStreamBinding<SolutionEntity>({
  type: 'SolutionEntity',
  insert(eventId, item) {
    return updateChallengeStats(eventId, item.challengeId, 'solutions', 1);
  },
  remove(eventId, item) {
    return updateChallengeStats(eventId, item.challengeId, 'solutions', -1);
  },
});

export const handleSubmission = createDynamoStreamBinding<SolutionEntity>({
  type: 'SubmissionEntity',
  insert(eventId, item) {
    return updateChallengeStats(eventId, item.challengeId, 'submissions', 1);
  },
  remove(eventId, item) {
    return updateChallengeStats(eventId, item.challengeId, 'submissions', -1);
  },
});

export const handleChallengeSolved = createDynamoStreamBinding<
  ChallengeSolvedEntity
>({
  type: 'ChallengeSolvedEntity',
  insert(eventId, item) {
    return updateChallengeStats(eventId, item.challengeId, 'solved', 1);
  },
  remove(eventId, item) {
    return updateChallengeStats(eventId, item.challengeId, 'solved', -1);
  },
});
