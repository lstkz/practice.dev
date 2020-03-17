import { createContract, createRpcBinding } from '../../lib';
import { S, ValidationError } from 'schema';
import { createKey, queryIndex } from '../../common/db';
import { UnreachableCaseError } from '../../common/errors';
import { DbSubmission } from '../../types';
import { mapDbSubmissionMany } from '../../common/mapping';
import { getUsersByIds } from '../user/getUsersByIds';
import { SearchResult, Submission } from 'shared';
import * as db from '../../common/db-next';
import { UserUsernameEntity, SubmissionEntity } from '../../entities';

export const searchSubmissions = createContract('submission.searchSubmissions')
  .params('criteria')
  .schema({
    criteria: S.object().keys({
      challengeId: S.number().optional(),
      username: S.string().optional(),
      limit: S.pageSize(),
      cursor: S.string()
        .optional()
        .nullable(),
    }),
  })
  .fn(async criteria => {
    const { challengeId, username } = criteria;
    if (!challengeId && !username) {
      throw new ValidationError(
        'challengeId or username must be both defined',
        []
      );
    }
    const getKey = async () => {
      const user = await db.getOrNull(UserUsernameEntity, { username });
      if (!user) {
        return null;
      }
      if (username && challengeId) {
        return SubmissionEntity.createUserChallengeKey({
          challengeId,
          userId: user!.userId,
          submissionId: '-1',
        });
      }
      if (username) {
        return SubmissionEntity.createUserKey({
          userId: user!.userId,
          submissionId: '-1',
        });
      }
      if (challengeId) {
        return SubmissionEntity.createChallengeKey({
          challengeId,
          submissionId: '-1',
        });
      }
      throw new UnreachableCaseError('' as never);
    };
    const key = await getKey();
    if (!key) {
      return {
        items: [],
        cursor: null,
      } as SearchResult<Submission>;
    }
    const { items, cursor } = await queryIndex<DbSubmission>({
      index: 'sk-data_n-index',
      sk: key.sk,
      cursor: criteria.cursor,
      descending: true,
      limit: criteria.limit,
    });
    const users = await getUsersByIds(items.map(x => x.userId));
    const submissions = mapDbSubmissionMany(items, users);
    return {
      items: submissions,
      cursor,
    };
  });

export const searchSubmissionsRpc = createRpcBinding({
  public: true,
  signature: 'submission.searchSubmissions',
  handler: searchSubmissions,
});
