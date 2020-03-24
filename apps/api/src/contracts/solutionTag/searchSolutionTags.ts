import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import * as solutionReader from '../../readers/solutionReader';

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
    const { items, cursor } = await solutionReader.searchSolutionTags({
      challengeId: criteria.challengeId,
      keyword: criteria.keyword,
      limit: criteria.limit,
      cursor: criteria.cursor,
      descending: false,
    });
    return {
      items: items.map(x => x.toSolutionTag()),
      cursor,
    };
  });

export const searchSolutionsRpc = createRpcBinding({
  public: true,
  signature: 'solutionTags.searchSolutionTags',
  handler: searchSolutionTags,
});
