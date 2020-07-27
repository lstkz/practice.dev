import { S } from 'schema';
import { createContract, createRpcBinding, createTransaction } from '../../lib';
import {
  UserEntity,
  UserEmailEntity,
  UserUsernameEntity,
  TokenEntity,
  GithubUserEntity,
  SolutionEntity,
  SubmissionEntity,
  SocketConnectionEntity,
  ResetPasswordCodeEntity,
  DiscussionSubscriptionEntity,
  ConfirmCodeEntity,
  ChallengeSolvedEntity,
  FeatureSubscriptionEntity,
  SolutionVoteEntity,
} from '../../entities';
import { esSearch } from '../../common/elastic';
import { removeSolutionCUD } from '../../cud/solution';
import { removeSubmissionCUD } from '../../cud/submission';
import { ChangeEmailRequestEntity } from '../../entities/ChangeEmailRequestEntity';
import { DiscussionCommentEntity } from '../../entities/DiscussionCommentEntity';
import { removeSolutionVoteCUD } from '../../cud/solutionVote';
import { AppError } from '../../common/errors';

export const deleteUser = createContract('user.deleteUser')
  .params('usernameOrEmail')
  .schema({
    usernameOrEmail: S.string(),
  })
  .fn(async usernameOrEmail => {
    const user = await UserEntity.getUserByEmailOrUsernameOrNull(
      usernameOrEmail
    );
    if (!user) {
      throw new AppError('User not found');
    }
    const userId = user.userId;
    const userIdQuery = {
      query: {
        bool: {
          must: [
            {
              term: { 'userId.keyword': userId },
            },
          ],
        },
      },
      sort: [
        {
          _id: 'asc' as const,
        },
      ],
      limit: 1000,
    };
    const t = createTransaction();
    t.delete(user);
    await Promise.all([
      UserEmailEntity.getByKey({
        email: user.email,
      }).then(ret => t.delete(ret)),
      UserUsernameEntity.getByKey({
        username: user.username,
      }).then(ret => t.delete(ret)),
      esSearch(GithubUserEntity, userIdQuery).then(ret =>
        ret.items.forEach(item => t.delete(item))
      ),
    ]);
    await Promise.all(
      [
        TokenEntity,
        ChangeEmailRequestEntity,
        SocketConnectionEntity,
        ResetPasswordCodeEntity,
        DiscussionSubscriptionEntity,
        DiscussionCommentEntity,
        ConfirmCodeEntity,
        ChallengeSolvedEntity,
        FeatureSubscriptionEntity,
      ].map(async entity => {
        const ret = await esSearch(entity as typeof TokenEntity, userIdQuery);
        await (entity as typeof TokenEntity).batchDelete(ret.items);
      })
    );
    const solutionVotes = await esSearch(SolutionVoteEntity, userIdQuery);
    await Promise.all(solutionVotes.items.map(removeSolutionVoteCUD));

    const solutions = await esSearch(SolutionEntity, userIdQuery);
    await Promise.all(solutions.items.map(removeSolutionCUD));

    const submissions = await esSearch(SubmissionEntity, userIdQuery);
    await Promise.all(submissions.items.map(removeSubmissionCUD));

    await esSearch(FeatureSubscriptionEntity, {
      query: {
        term: {
          'sk.keyword': FeatureSubscriptionEntity.createKey({
            email: user.email,
            type: 'any',
          }).sk,
        },
      },
      sort: [
        {
          _id: 'asc' as const,
        },
      ],
      limit: 1000,
    }).then(async ret => {
      await FeatureSubscriptionEntity.batchDelete(ret.items);
    });

    await t.commit();
  });

export const getMeRpc = createRpcBinding({
  admin: true,
  signature: 'user.deleteUser',
  handler: deleteUser,
});
