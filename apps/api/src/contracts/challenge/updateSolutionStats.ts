import { createContract, createDynamoStreamBinding } from '../../lib';
import { S } from 'schema';
import { Converter } from 'aws-sdk/clients/dynamodb';
import { DbSolution, DbChallengeSolved } from '../../types';
import { transactWriteItems, createKey } from '../../common/db';
import { ignoreTransactionCanceled } from '../../common/helper';

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
    const key = createKey({ type: 'CHALLENGE', id: challengeId });
    await transactWriteItems({
      conditionalPutItems: [
        {
          expression: 'attribute_not_exists(pk)',
          item: createKey({
            type: 'EVENT',
            eventId,
          }),
        },
      ],
      updateItems: [
        {
          Key: Converter.marshall(key),
          UpdateExpression: `SET stats.${name} = stats.${name} + :inc`,
          ExpressionAttributeValues: Converter.marshall({
            ':inc': add,
          }),
        },
      ],
    }).catch(ignoreTransactionCanceled());
  });

export const handleSolution = createDynamoStreamBinding<DbSolution>({
  type: 'Solution',
  insert(eventId, item) {
    return updateChallengeStats(eventId, item.challengeId, 'solutions', 1);
  },
  remove(eventId, item) {
    return updateChallengeStats(eventId, item.challengeId, 'solutions', -1);
  },
});

export const handleSubmission = createDynamoStreamBinding<DbSolution>({
  type: 'Submission',
  insert(eventId, item) {
    return updateChallengeStats(eventId, item.challengeId, 'submissions', 1);
  },
  remove(eventId, item) {
    return updateChallengeStats(eventId, item.challengeId, 'submissions', -1);
  },
});

export const handleChallengeSolved = createDynamoStreamBinding<
  DbChallengeSolved
>({
  type: 'ChallengeSolved',
  insert(eventId, item) {
    return updateChallengeStats(eventId, item.challengeId, 'solved', 1);
  },
  remove(eventId, item) {
    return updateChallengeStats(eventId, item.challengeId, 'solved', -1);
  },
});
