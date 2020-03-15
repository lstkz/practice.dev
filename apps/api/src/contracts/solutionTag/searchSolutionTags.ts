import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { DbSolutionTag } from '../../types';
import { createKey, queryRaw } from '../../common/db';
import { mapDbSolutionTagMany } from '../../common/mapping';
import { Converter } from 'aws-sdk/clients/dynamodb';

export const searchSolutionTags = createContract('solutionTags.searchSolutions')
  .params('criteria')
  .schema({
    criteria: S.object().keys({
      challengeId: S.number(),
      keyword: S.string()
        .optional()
        .trim(),
      limit: S.pageSize(),
      cursor: S.string()
        .optional()
        .nullable(),
    }),
  })
  .fn(async criteria => {
    const { sk } = createKey({
      type: 'GLOBAL_SOLUTION_TAG',
      challengeId: criteria.challengeId,
      tag: '',
    });

    const { items, cursor } = await queryRaw<DbSolutionTag>(
      'sk-data-index',
      criteria.keyword ? 'sk = :sk AND begins_with(#data, :name)' : 'sk = :sk',
      Converter.marshall({
        ':sk': sk,
        ':min': 0,
        ...(criteria.keyword ? { ':name': criteria.keyword } : {}),
      }),
      {
        filter: {
          expression: '#count > :min',
          values: Converter.marshall({
            ':min': 0,
          }),
          names: {
            '#count': 'count',
            ...(criteria.keyword ? { '#data': 'data' } : {}),
          },
        },
        cursor: criteria.cursor,
        descending: false,
        limit: criteria.limit,
      }
    );

    return {
      items: mapDbSolutionTagMany(items),
      cursor,
    };
  });

export const searchSolutionsRpc = createRpcBinding({
  public: true,
  signature: 'solutionTags.searchSolutionTags',
  handler: searchSolutionTags,
});
