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
import { AppError } from '../../common/errors';
import { assertProjectChallengePermission } from '../project/checkProjectChallengePermission';

export const searchSubmissions = createContract('submission.searchSubmissions')
  .params('userId', 'criteria')
  .schema({
    userId: S.string().optional(),
    criteria: S.object().keys({
      challengeId: S.number().min(1).optional(),
      projectId: S.number().min(1).optional(),
      username: S.string().optional(),
      limit: S.pageSize(),
      cursor: S.string().optional().nullable(),
    }),
  })
  .fn(async (userId, criteria) => {
    const { challengeId, username, projectId } = criteria;

    if (projectId) {
      if (!challengeId) {
        throw new AppError('challengeId is required if projectId is defined');
      }
      await assertProjectChallengePermission(userId, {
        projectId,
        challengeId,
      });
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
      const esCriteria: any[] = [
        {
          match: { type: projectId ? 'project' : 'challenge' },
        },
      ];
      if (userId) {
        esCriteria.push({
          match: { userId },
        });
      }
      if (projectId) {
        esCriteria.push({
          match: { projectId },
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
  injectUser: true,
  public: true,
  signature: 'submission.searchSubmissions',
  handler: searchSubmissions,
});
