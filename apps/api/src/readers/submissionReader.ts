import { SubmissionEntity } from '../entities';
import { dynamodb } from '../lib';
import { TABLE_NAME } from '../config';
import { Converter, QueryOutput } from 'aws-sdk/clients/dynamodb';
import { decLastKey, encLastKey } from '../common/helper';
import * as db from '../common/db-next';

export async function getById(id: string) {
  return await db.get(SubmissionEntity, {
    submissionId: id,
  });
}

interface BaseSearchCriteria {
  limit?: number;
  descending?: boolean;
  cursor?: string | null;
}

function _getBaseQuery(
  criteria: BaseSearchCriteria,
  index?: 'sk-data-index' | 'sk-data_n-index'
) {
  return {
    TableName: TABLE_NAME,
    IndexName: index,
    Limit: criteria.limit,
    ExclusiveStartKey: criteria.cursor
      ? decLastKey(criteria.cursor)
      : undefined,
    ScanIndexForward: !criteria.descending,
  };
}

function _mapQueryResult<
  T extends {
    new (values: any): any;
  }
>(
  Entity: T,
  result: QueryOutput
): { items: Array<InstanceType<T>>; cursor: string | null } {
  return {
    items: (result.Items || []).map(item => {
      const values = Converter.unmarshall(item);
      return new Entity(values);
    }),
    cursor: encLastKey(result.LastEvaluatedKey),
  };
}

function _mapSubmissionQueryResult(result: QueryOutput) {
  const ret = _mapQueryResult(SubmissionEntity, result);
  return {
    items: ret.items.map(item => item.asMainEntity()),
    cursor: ret.cursor,
  };
}

function _getSkQueryParams(sk: string) {
  return {
    KeyConditionExpression: 'sk = :sk',
    ExpressionAttributeValues: Converter.marshall({
      ':sk': sk,
    }),
  };
}

async function _searchBySk(criteria: BaseSearchCriteria, sk: string) {
  const result = await dynamodb
    .query({
      ..._getBaseQuery(criteria, 'sk-data_n-index'),
      ..._getSkQueryParams(sk),
    })
    .promise();
  return _mapSubmissionQueryResult(result);
}

interface SearchByUserChallengeCriteria extends BaseSearchCriteria {
  userId: string;
  challengeId: number;
}

export async function searchByUserChallenge(
  criteria: SearchByUserChallengeCriteria
) {
  const { sk } = SubmissionEntity.createUserChallengeKey({
    challengeId: criteria.challengeId,
    userId: criteria.userId,
    submissionId: '-1',
  });
  return _searchBySk(criteria, sk);
}

interface SearchByUserCriteria extends BaseSearchCriteria {
  userId: string;
}

export async function searchByUser(criteria: SearchByUserCriteria) {
  const { sk } = SubmissionEntity.createUserKey({
    userId: criteria.userId,
    submissionId: '-1',
  });
  return _searchBySk(criteria, sk);
}

interface SearchByChallengeCriteria extends BaseSearchCriteria {
  challengeId: number;
}

export async function searchByChallenge(criteria: SearchByChallengeCriteria) {
  const { sk } = SubmissionEntity.createChallengeKey({
    challengeId: criteria.challengeId,
    submissionId: '-1',
  });
  return _searchBySk(criteria, sk);
}
