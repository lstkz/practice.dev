import { createContract, createDynamoStreamBinding } from '../../lib';
import { S } from 'schema';
import { Converter } from 'aws-sdk/clients/dynamodb';
import { DbSolution, DbChallengeSolved, StreamAction } from '../../types';
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

function _getAdd(type: StreamAction) {
  if (type === 'INSERT') {
    return 1;
  }
  if (type === 'REMOVE') {
    return -1;
  }
  throw new Error('Not supported add: ' + type);
}

export const incSolutionStats = createDynamoStreamBinding<DbSolution>({
  type: 'Solution',
  insert: true,
  remove: true,
  handler(eventId, type, item) {
    return updateChallengeStats(
      eventId,
      item.challengeId,
      'solutions',
      _getAdd(type)
    );
  },
});

export const incSubmissionStats = createDynamoStreamBinding<DbSolution>({
  type: 'Submission',
  insert: true,
  remove: true,
  handler(eventId, type, item) {
    return updateChallengeStats(
      eventId,
      item.challengeId,
      'submissions',
      _getAdd(type)
    );
  },
});

export const incSolvedStats = createDynamoStreamBinding<DbChallengeSolved>({
  type: 'ChallengeSolved',
  insert: true,
  remove: true,
  handler(eventId, type, item) {
    return updateChallengeStats(
      eventId,
      item.challengeId,
      'solved',
      _getAdd(type)
    );
  },
});
