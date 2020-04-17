import {
  createContract,
  createDynamoStreamBinding,
  createTransaction,
} from '../../lib';
import { S } from 'schema';
import {
  SolutionEntity,
  EventEntity,
  UserEntity,
  SolutionVoteEntity,
} from '../../entities';
import { TABLE_NAME } from '../../config';

export const updateUserStats = createContract('user.updateUserStats')
  .params('eventId', 'userId', 'name', 'add')
  .schema({
    eventId: S.string(),
    userId: S.string(),
    name: S.enum().literal(
      'solutions',
      'likes',
      'followers',
      'following',
      'submissions'
    ),
    add: S.number(),
  })
  .fn(async (eventId, userId, name, add) => {
    const t = createTransaction();
    EventEntity.addToTransaction(t, eventId);
    t.updateRaw({
      tableName: TABLE_NAME,
      key: UserEntity.createKey({ userId }),
      updateExpression: `SET stats.${name} = if_not_exists(stats.${name}, :zero) + :inc`,
      expressionValues: {
        ':inc': add,
        ':zero': 0,
      },
    });
    await t.commit({
      ignoreTransactionCanceled: true,
    });
  });

export const handleSolution = createDynamoStreamBinding<SolutionEntity>({
  type: 'SolutionEntity',
  async insert(eventId, item) {
    await updateUserStats(eventId, item.userId, 'solutions', 1);
  },
  async remove(eventId, item) {
    await updateUserStats(eventId, item.userId, 'solutions', -1);
  },
});

export const handleSubmission = createDynamoStreamBinding<SolutionEntity>({
  type: 'SubmissionEntity',
  async insert(eventId, item) {
    await updateUserStats(eventId, item.userId, 'submissions', 1);
  },
  async remove(eventId, item) {
    await updateUserStats(eventId, item.userId, 'submissions', -1);
  },
});

export const handleSolutionVote = createDynamoStreamBinding<SolutionVoteEntity>(
  {
    type: 'SolutionVoteEntity',
    async insert(eventId, item) {
      await updateUserStats(eventId, item.userId, 'likes', 1);
    },
    async remove(eventId, item) {
      await updateUserStats(eventId, item.userId, 'likes', -1);
    },
  }
);
