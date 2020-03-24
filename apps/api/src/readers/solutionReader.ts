import {
  SolutionEntity,
  SolutionVoteEntity,
  SolutionTagStatsEntity,
} from '../entities';
import {
  queryAll,
  getBaseQuery,
  getPkQueryParams,
  getOrNull,
  BaseSearchCriteria,
} from '../common/db-next';
import * as db from '../common/db-next';
import { dynamodb } from '../lib';
import { TABLE_NAME } from '../config';
import { Converter, QueryOutput } from 'aws-sdk/clients/dynamodb';

function _getPkFromId(id: string) {
  const { pk } = SolutionEntity.createKey({
    solutionId: id,
    challengeId: -1,
  });
  return pk;
}

export async function getByIdOrNull(id: string, consistentRead = false) {
  const ret = await queryAll(SolutionEntity, {
    ...getBaseQuery({}),
    ...getPkQueryParams(_getPkFromId(id)),
    ConsistentRead: consistentRead,
  });
  return ret.length ? ret[0] : null;
}
export async function getById(id: string) {
  const item = await getByIdOrNull(id);
  if (!item) {
    throw new Error(`Solution not found with pk=${_getPkFromId(id)}`);
  }
  return item;
}

export async function getSolutionVoteOrNull(
  solutionId: string,
  userId: string
) {
  return getOrNull(SolutionVoteEntity, {
    solutionId,
    userId,
  });
}

export async function getSolutionBySlugOrNull(
  challengeId: number,
  slug: string
) {
  const { Item: item } = await dynamodb
    .getItem({
      TableName: TABLE_NAME,
      Key: Converter.marshall(
        SolutionEntity.createSlugKey({ challengeId, slug })
      ),
    })
    .promise();
  if (!item) {
    return null;
  }
  return new SolutionEntity(Converter.unmarshall(item) as any);
}

function _mapSubmissionQueryResult(result: QueryOutput) {
  const ret = db.mapQueryResult(SolutionEntity, result);
  return {
    items: ret.items.map(item => item.asMainEntity()),
    cursor: ret.cursor,
  };
}

interface BaseSolutionSearchCriteria extends BaseSearchCriteria {
  sortBy: 'date' | 'likes';
}

async function _searchBySk(criteria: BaseSolutionSearchCriteria, sk: string) {
  const result = await dynamodb
    .query({
      ...db.getBaseQuery(
        criteria,
        criteria.sortBy === 'date' ? 'sk-data_n-index' : 'sk-data2_n-index'
      ),
      ...db.getSkQueryParams(sk),
    })
    .promise();
  return _mapSubmissionQueryResult(result);
}

interface SearchByChallengeUserCriteria extends BaseSolutionSearchCriteria {
  userId: string;
  challengeId: number;
}

export async function searchByChallengeUser(
  criteria: SearchByChallengeUserCriteria
) {
  const { sk } = SolutionEntity.createChallengeUserKey({
    challengeId: criteria.challengeId,
    userId: criteria.userId,
    solutionId: '-1',
  });
  return _searchBySk(criteria, sk);
}

interface SearchByUserCriteria extends BaseSolutionSearchCriteria {
  userId: string;
}

export async function searchByUser(criteria: SearchByUserCriteria) {
  const { sk } = SolutionEntity.createUserKey({
    userId: criteria.userId,
    solutionId: '-1',
  });
  return _searchBySk(criteria, sk);
}

interface SearchByChallengeCriteria extends BaseSolutionSearchCriteria {
  challengeId: number;
}

export async function searchByChallenge(criteria: SearchByChallengeCriteria) {
  const { sk } = SolutionEntity.createKey({
    challengeId: criteria.challengeId,
    solutionId: '-1',
  });
  return _searchBySk(criteria, sk);
}

interface SearchByTagsCriteria extends BaseSolutionSearchCriteria {
  challengeId: number;
  tags: string[];
  userId?: string | null;
}

export async function searchByTags(criteria: SearchByTagsCriteria) {
  const [first, ...restTags] = criteria.tags;
  const { sk } = SolutionEntity.createTagKey({
    challengeId: criteria.challengeId,
    tag: first,
    solutionId: '-1',
  });
  const queryParams = db.getSkQueryParams(sk);
  const filter = _createSolutionFilter(criteria.userId, restTags);
  const result = await dynamodb
    .query({
      ...db.getBaseQuery(criteria, 'sk-data_n-index'),
      KeyConditionExpression: queryParams.KeyConditionExpression,
      FilterExpression: filter.FilterExpression,
      ExpressionAttributeValues: {
        ...queryParams.ExpressionAttributeValues,
        ...filter.ExpressionAttributeValues,
      },
    })
    .promise();
  return _mapSubmissionQueryResult(result);
}

function _createSolutionFilter(
  userId: string | undefined | null,
  tags: string[] | undefined | null
) {
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
    return {
      ExpressionAttributeValues: {},
    };
  }

  return {
    FilterExpression: conditions.join(' AND '),
    ExpressionAttributeValues: Converter.marshall(values),
  };
}

export async function getUserSolutionVotes(
  userId: string | undefined,
  solutions: SolutionEntity[]
) {
  if (!userId || !solutions.length) {
    return [] as SolutionVoteEntity[];
  }
  const voteKey = SolutionVoteEntity.createKey({
    solutionId: '-1',
    userId,
  });
  return await db.queryAll(SolutionVoteEntity, {
    TableName: TABLE_NAME,
    IndexName: 'sk-data_n-index',
    KeyConditionExpression: 'sk = :sk',
    FilterExpression: `solutionId IN (${solutions
      .map((_, i) => `:s${i}`)
      .join(',')})`,
    ExpressionAttributeValues: Converter.marshall({
      ':sk': voteKey.sk,
      ...solutions.reduce((ret, solution, i) => {
        ret[`:s${i}`] = solution.solutionId;
        return ret;
      }, {} as Record<string, any>),
    }),
  });
}

interface SearchSolutionTagsCriteria extends BaseSearchCriteria {
  keyword?: string;
  challengeId: number;
}

export function searchSolutionTags(criteria: SearchSolutionTagsCriteria) {
  const { sk } = SolutionTagStatsEntity.createKey({
    tag: '',
    challengeId: criteria.challengeId,
  });
  return db.query(SolutionTagStatsEntity, {
    ...db.getBaseQuery(criteria, 'sk-data-index'),
    KeyConditionExpression: criteria.keyword
      ? 'sk = :sk AND begins_with(#data, :name)'
      : 'sk = :sk',
    FilterExpression: '#count > :min',
    ExpressionAttributeValues: Converter.marshall({
      ':min': 0,
      ':sk': sk,
      ...(criteria.keyword ? { ':name': criteria.keyword } : {}),
    }),
    ExpressionAttributeNames: {
      '#count': 'count',
      ...(criteria.keyword ? { '#data': 'data' } : {}),
    },
  });
}
