import {
  getBaseQuery,
  getSkQueryParams,
  queryAll,
  getPkQueryParams,
  BaseSearchCriteria,
  query,
  get,
  getOrNull,
} from '../common/db-next';
import { ChallengeSolvedEntity, ChallengeEntity } from '../entities';

export async function getChallengeByIdOrNull(id: number) {
  return getOrNull(ChallengeEntity, {
    challengeId: id,
  });
}

export async function getChallengesAll() {
  return queryAll(ChallengeEntity, {
    ...getBaseQuery({}, 'sk-data_n-index'),
    ...getSkQueryParams('CHALLENGE'),
  });
}

export async function getIsSolved(
  userId: string | undefined,
  challengeId: number
) {
  if (!userId) {
    return false;
  }
  const solved = await getOrNull(ChallengeSolvedEntity, {
    challengeId,
    userId,
  });
  return solved != null;
}

export async function getSolvedChallengeIds(userId: string | undefined) {
  if (!userId) {
    return [];
  }
  const key = ChallengeSolvedEntity.createKey({
    userId: userId,
    challengeId: -1,
  });
  const items = await queryAll(ChallengeSolvedEntity, {
    ...getBaseQuery({}),
    ...getPkQueryParams(key.pk),
  });

  return items.map(item => item.challengeId);
}

interface SearchSolvedByUserIdCriteria extends BaseSearchCriteria {
  userId: string;
}

export async function searchSolvedByUserId(
  criteria: SearchSolvedByUserIdCriteria
) {
  const { pk } = ChallengeSolvedEntity.createKey({
    challengeId: -1,
    userId: criteria.userId,
  });
  return query(ChallengeSolvedEntity, {
    ...getBaseQuery(criteria),
    ...getPkQueryParams(pk),
  });
}
interface SearchSolvedByChallengeIdCriteria extends BaseSearchCriteria {
  challengeId: number;
}

export async function searchSolvedByChallengeId(
  criteria: SearchSolvedByChallengeIdCriteria
) {
  const { sk } = ChallengeSolvedEntity.createKey({
    challengeId: criteria.challengeId,
    userId: '-1',
  });
  return query(ChallengeSolvedEntity, {
    ...getBaseQuery(criteria),
    ...getSkQueryParams(sk),
  });
}
