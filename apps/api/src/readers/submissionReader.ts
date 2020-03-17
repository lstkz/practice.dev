import { SubmissionEntity } from '../entities';
import { dynamodb } from '../lib';
import { QueryOutput } from 'aws-sdk/clients/dynamodb';
import * as db from '../common/db-next';
import { BaseSearchCriteria } from '../common/db-next';

export async function getById(id: string) {
  return await db.get(SubmissionEntity, {
    submissionId: id,
  });
}

function _mapSubmissionQueryResult(result: QueryOutput) {
  const ret = db.mapQueryResult(SubmissionEntity, result);
  return {
    items: ret.items.map(item => item.asMainEntity()),
    cursor: ret.cursor,
  };
}

async function _searchBySk(criteria: BaseSearchCriteria, sk: string) {
  const result = await dynamodb
    .query({
      ...db.getBaseQuery(criteria, 'sk-data_n-index'),
      ...db.getSkQueryParams(sk),
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
