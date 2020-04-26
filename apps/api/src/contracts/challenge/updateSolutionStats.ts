import {
  createContract,
  createDynamoStreamBinding,
  createTransaction,
} from '../../lib';
import { S } from 'schema';
import {
  EventEntity,
  SolutionEntity,
  ChallengeSolvedEntity,
  ChallengeEntity,
} from '../../entities';
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
    const t = createTransaction();
    EventEntity.addToTransaction(t, eventId);
    t.updateRaw({
      tableName: TABLE_NAME,
      key: ChallengeEntity.createKey({ challengeId }),
      updateExpression: `SET stats.${name} = stats.${name} + :inc`,
      expressionValues: {
        ':inc': add,
      },
    });
    await t.commit({
      ignoreTransactionCanceled: true,
    });
  });

export const handleSolution = createDynamoStreamBinding<SolutionEntity>({
  type: 'SolutionEntity',
  async insert(eventId, item) {
    await updateChallengeStats(eventId, item.challengeId, 'solutions', 1);
  },
  async remove(eventId, item) {
    await updateChallengeStats(eventId, item.challengeId, 'solutions', -1);
  },
});

export const handleSubmission = createDynamoStreamBinding<SolutionEntity>({
  type: 'SubmissionEntity',
  async insert(eventId, item) {
    await updateChallengeStats(eventId, item.challengeId, 'submissions', 1);
  },
  async remove(eventId, item) {
    await updateChallengeStats(eventId, item.challengeId, 'submissions', -1);
  },
});

export const handleChallengeSolved = createDynamoStreamBinding<
  ChallengeSolvedEntity
>({
  type: 'ChallengeSolvedEntity',
  async insert(eventId, item) {
    await updateChallengeStats(eventId, item.challengeId, 'solved', 1);
  },
  async remove(eventId, item) {
    await updateChallengeStats(eventId, item.challengeId, 'solved', -1);
  },
});
