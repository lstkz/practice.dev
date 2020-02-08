import { Solution, SearchResult } from 'shared';
import { S } from 'schema';
import { Converter } from 'aws-sdk/clients/dynamodb';
import { createContract, createRpcBinding } from '../../lib';
import { UnreachableCaseError, AppError } from '../../common/errors';
import { getDbUserByUsername } from '../user/getDbUserByUsername';
import { queryIndex, createKey, queryIndexAll } from '../../common/db';
import { DbSolution, DbSolutionVote } from '../../types';
import { mapDbSolutionSolvedMany } from '../../common/mapping';
import { getUsersByIds } from '../user/getUsersByIds';
import DynamoDB = require('aws-sdk/clients/dynamodb');

function _createFilter(userId: string | undefined, tags: string[] | undefined) {
  const conditions: string[] = [];
  const values: { [key: string]: any } = {};
  if (userId) {
    conditions.push(`userId = :f_userId`);
    values[':f_userId'] = userId;
  }
  if (tags?.length) {
    tags.forEach((tag, i) => {
      conditions.push(`contains(tags, :f_tag_${i})`);
      values[`:f_tag_${i}`] = tag;
    });
  }

  if (!conditions.length) {
    return undefined;
  }

  return {
    expression: conditions.join(' AND '),
    values: Converter.marshall(values),
  };
}

async function getDbSolutionVotes(
  userId: string | undefined,
  solutions: DbSolution[]
) {
  if (!userId || !solutions.length) {
    return [] as DbSolutionVote[];
  }
  const voteKey = createKey({
    type: 'SOLUTION_VOTE',
    solutionId: '-1',
    userId,
  });
  return await queryIndexAll<DbSolutionVote>({
    index: 'sk-data_n-index',
    sk: voteKey.sk,
    filter: {
      expression: `solutionId IN (${solutions
        .map((_, i) => `:s${i}`)
        .join(',')})`,
      values: solutions.reduce((ret, solution, i) => {
        ret[`:s${i}`] = { S: solution.solutionId };
        return ret;
      }, {} as { [key: string]: DynamoDB.AttributeValue }),
    },
  });
}

export const searchSolutions = createContract('solution.searchSolutions')
  .params('userId', 'criteria')
  .schema({
    userId: S.string().optional(),
    criteria: S.object().keys({
      challengeId: S.number().optional(),
      username: S.string().optional(),
      tags: S.array()
        .items(S.string())
        .max(5)
        .optional(),
      limit: S.pageSize(),
      cursor: S.string()
        .optional()
        .nullable(),
      sortBy: S.enum().values<'likes' | 'date'>(['likes', 'date']),
      sortDesc: S.boolean(),
    }),
  })
  .fn(async (userId, criteria) => {
    const { challengeId, username, tags, sortBy, sortDesc } = criteria;

    const user = username
      ? await getDbUserByUsername(username).catch(() => -1 as const)
      : null;
    if (user === -1) {
      return {
        items: [],
        cursor: null,
      } as SearchResult<Solution>;
    }

    const getQueryParams = async () => {
      if (!challengeId && tags) {
        throw new AppError(
          'Cannot search by tags if challengeId is not defined'
        );
      }
      if (!challengeId && !username) {
        throw new AppError('challengeId or username is required');
      }
      if (tags?.length) {
        const [first, ...restTags] = tags;
        const key = createKey({
          type: 'SOLUTION_TAG',
          challengeId: challengeId!,
          solutionId: '-1',
          tag: first,
        });
        return {
          sk: key.sk,
          filter: _createFilter(user?.userId, restTags),
        };
      }
      if (username && challengeId) {
        const key = createKey({
          type: 'SOLUTION_CHALLENGE_USER',
          challengeId: challengeId,
          solutionId: '-1',
          userId: user!.userId,
        });
        return {
          sk: key.sk,
          filter: _createFilter(undefined, tags),
        };
      }
      if (username) {
        const key = createKey({
          type: 'SOLUTION_USER',
          solutionId: '-1',
          userId: user!.userId,
        });
        return {
          sk: key.sk,
        };
      }
      if (challengeId) {
        const key = createKey({
          type: 'SOLUTION',
          challengeId: challengeId,
          solutionId: '-1',
        });
        return {
          sk: key.sk,
        };
      }

      throw new UnreachableCaseError('Unhandled query condition' as never);
    };

    const { items, cursor } = await queryIndex<DbSolution>({
      index: sortBy === 'date' ? 'sk-data_n-index' : 'sk-data2_n-index',
      ...(await getQueryParams()),
      cursor: criteria.cursor,
      descending: sortDesc,
      limit: criteria.limit,
    });
    const [users, dbVotes] = await Promise.all([
      getUsersByIds(items.map(x => x.userId)),
      getDbSolutionVotes(userId, items),
    ]);
    const solutions = mapDbSolutionSolvedMany(items, users, dbVotes);
    return {
      items: solutions,
      cursor,
    };
  });

export const searchSolutionsRpc = createRpcBinding({
  public: true,
  injectUser: true,
  signature: 'solution.searchSolutions',
  handler: searchSolutions,
});
