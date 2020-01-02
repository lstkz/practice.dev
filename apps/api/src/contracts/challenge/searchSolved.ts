import { QueryInput } from 'aws-sdk/clients/dynamodb';
import {
  createContract,
  createRpcBinding,
  dynamodb,
  TABLE_NAME,
} from '../../lib';
import { Converter } from 'aws-sdk/clients/dynamodb';
import { S } from 'schema';
import { AppError } from '../../common/errors';
import { decLastKey, encLastKey } from '../../common/helper';
import { createKey } from '../../common/db';
import { getDbUserByUsername } from '../user/getDbUserByUsername';
import { getUsersByIds } from '../user/getUsersByIds';
import { DbChallengeSolved } from '../../types';
import { mapDbChallengeSolvedMany } from '../../common/mapping';

export const searchSolved = createContract('challenge.searchSolved')
  .params('criteria')
  .schema({
    criteria: S.object().keys({
      challengeId: S.number().optional(),
      username: S.string().optional(),
      limit: S.pageSize(),
      lastKey: S.string().optional(),
    }),
  })
  .fn(async criteria => {
    const { challengeId, username } = criteria;
    if (!challengeId && !username) {
      throw new AppError('challengeId or username must be defined');
    }

    const getQuery = async (): Promise<Partial<QueryInput> | null> => {
      if (username) {
        try {
          const { userId } = await getDbUserByUsername(username);
          const { pk } = createKey({
            type: 'CHALLENGE_SOLVED',
            challengeId: -1,
            userId,
          });
          return {
            KeyConditionExpression: 'pk = :pk',
            ExpressionAttributeValues: Converter.marshall({
              ':pk': pk,
            }),
          };
        } catch (e) {
          return null;
        }
      } else {
        const { sk } = createKey({
          type: 'CHALLENGE_SOLVED',
          challengeId: challengeId!,
          userId: '-1',
        });
        return {
          IndexName: 'sk-data_n-index',
          KeyConditionExpression: 'sk = :sk',
          ExpressionAttributeValues: Converter.marshall({
            ':sk': sk,
          }),
        };
      }
    };
    const query = await getQuery();
    if (!query) {
      return {
        items: [],
        lastKey: null,
      };
    }

    const { Items: rawItems = [], LastEvaluatedKey: lastKey } = await dynamodb
      .query(
        {
          TableName: TABLE_NAME,
          ...query,
          Limit: criteria.limit,
          ExclusiveStartKey: decLastKey(criteria.lastKey),
          ScanIndexForward: false,
        },
        undefined
      )
      .promise();
    const items = rawItems.map(
      item => Converter.unmarshall(item) as DbChallengeSolved
    );
    const users = await getUsersByIds(items.map(x => x.userId));
    return {
      items: mapDbChallengeSolvedMany(items, users),
      lastKey: encLastKey(lastKey),
    };
  });

export const searchSolvedRpc = createRpcBinding({
  public: true,
  signature: 'challenge.searchSolved',
  handler: searchSolved,
});
