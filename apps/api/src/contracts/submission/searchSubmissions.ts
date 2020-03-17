import { createContract, createRpcBinding } from '../../lib';
import { S, ValidationError } from 'schema';
import { UnreachableCaseError } from '../../common/errors';
import * as userReader from '../../readers/userReader';
import * as submissionReader from '../../readers/submissionReader';
import { SearchResult } from 'shared';
import { SubmissionEntity } from '../../entities';
import { doFn } from '../../common/helper';

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

    const { cursor, items } = await doFn(async () => {
      const userId = username
        ? await userReader.getIdByUsernameOrNull(username)
        : null;

      if (username && !userId) {
        return {
          items: [],
          cursor: null,
        } as SearchResult<SubmissionEntity>;
      }
      const baseCriteria = {
        limit: criteria.limit,
        descending: true,
        cursor: criteria.cursor,
      };
      if (userId && challengeId) {
        return submissionReader.searchByUserChallenge({
          ...baseCriteria,
          challengeId,
          userId,
        });
      }
      if (userId) {
        return submissionReader.searchByUser({
          ...baseCriteria,
          userId,
        });
      }
      if (challengeId) {
        return submissionReader.searchByChallenge({
          ...baseCriteria,
          challengeId,
        });
      }
      throw new UnreachableCaseError('' as never);
    });

    const users = await userReader.getByIds(items.map(x => x.userId));
    const submissions = SubmissionEntity.toSubmissionMany(items, users);
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
