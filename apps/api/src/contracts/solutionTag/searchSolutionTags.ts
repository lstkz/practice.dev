import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { SolutionTagStatsEntity } from '../../entities2';
import { decLastKey, encLastKey } from '../../common/helper';

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
    const { items, lastKey } = await SolutionTagStatsEntity.searchSolutionTags({
      challengeId: criteria.challengeId,
      keyword: criteria.keyword,
      limit: criteria.limit,
      lastKey: decLastKey(criteria.cursor),
      sort: 'asc',
    });
    return {
      items: items.map(x => x.toSolutionTag()),
      cursor: encLastKey(lastKey),
    };
  });

export const searchSolutionsRpc = createRpcBinding({
  public: true,
  signature: 'solutionTags.searchSolutionTags',
  handler: searchSolutionTags,
});
