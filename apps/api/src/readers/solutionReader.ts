import { SolutionEntity, SolutionVoteEntity } from '../entities';
import {
  queryAll,
  getBaseQuery,
  getPkQueryParams,
  getOrNull,
} from '../common/db-next';
import { dynamodb } from '../lib';
import { TABLE_NAME } from '../config';
import { Converter } from 'aws-sdk/clients/dynamodb';

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
