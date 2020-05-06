import { createContract, createRpcBinding } from '../../lib';
import { S } from 'schema';
import {
  SubmissionEntity,
  UserUsernameEntity,
  UserEntity,
} from '../../entities';
import { doFn } from '../../common/helper';
import { SearchResult } from '../../orm/types';
import { LoadMoreResult, Submission } from 'shared';
import { esSearch } from '../../common/elastic';

export const searchSubmissions = createContract('submission.searchSubmissions')
  .params('criteria')
  .schema({
    criteria: S.object().keys({
      challengeId: S.number().optional(),
      username: S.string().optional(),
      limit: S.pageSize(),
      cursor: S.string().optional().nullable(),
    }),
  })
  .fn(async criteria => {
    const { challengeId, username } = criteria;

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
      const esCriteria: any[] = [];
      if (userId) {
        esCriteria.push({
          match: { userId },
        });
      }
      if (challengeId) {
        esCriteria.push({
          match: { challengeId },
        });
      }
      return await esSearch(SubmissionEntity, {
        query: {
          bool: {
            must: esCriteria,
          },
        },
        sort: [
          {
            createdAt: 'desc',
          },
          {
            _id: 'asc',
          },
        ],
        limit: criteria.limit!,
        cursor: criteria.cursor,
      });
    });

    const users = await UserEntity.getByIds(items.map(x => x.userId));
    const submissions = SubmissionEntity.toSubmissionMany(items, users);
    return {
      items: submissions,
      cursor: lastKey,
    } as LoadMoreResult<Submission>;
  });

export const searchSubmissionsRpc = createRpcBinding({
  public: true,
  signature: 'submission.searchSubmissions',
  handler: searchSubmissions,
});
