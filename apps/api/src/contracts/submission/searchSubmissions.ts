import { createContract, createRpcBinding } from '../../lib';
import { S, ValidationError } from 'schema';
import { UnreachableCaseError } from '../../common/errors';
import {
  SubmissionEntity,
  UserUsernameEntity,
  UserEntity,
} from '../../entities2';
import { doFn, decLastKey, encLastKey } from '../../common/helper';
import { SearchResult, BaseSearchCriteria } from '../../orm/types';

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

    const { lastKey, items } = await doFn(async () => {
      const userId = username
        ? await UserUsernameEntity.getUserIdOrNull(username)
        : null;

      if (username && !userId) {
        return {
          items: [],
          lastKey: null,
        } as SearchResult<SubmissionEntity>;
      }
      const baseCriteria: BaseSearchCriteria = {
        limit: criteria.limit,
        sort: 'desc',
        lastKey: decLastKey(criteria.cursor),
      };
      if (userId && challengeId) {
        return SubmissionEntity.searchByUserChallenge({
          ...baseCriteria,
          challengeId,
          userId,
        });
      }
      if (userId) {
        return SubmissionEntity.searchByUser({
          ...baseCriteria,
          userId,
        });
      }
      if (challengeId) {
        return SubmissionEntity.searchByChallenge({
          ...baseCriteria,
          challengeId,
        });
      }
      throw new UnreachableCaseError('' as never);
    });

    const users = await UserEntity.getByIds(items.map(x => x.userId));
    const submissions = SubmissionEntity.toSubmissionMany(items, users);
    return {
      items: submissions,
      cursor: encLastKey(lastKey),
    };
  });

export const searchSubmissionsRpc = createRpcBinding({
  public: true,
  signature: 'submission.searchSubmissions',
  handler: searchSubmissions,
});
