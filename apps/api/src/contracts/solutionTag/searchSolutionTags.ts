import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { SolutionTagStatsEntity } from '../../entities';
import { LoadMoreResult, SolutionTag } from 'shared';
import { esSearch } from '../../common/elastic';

export const searchSolutionTags = createContract('solutionTags.searchSolutions')
  .params('criteria')
  .schema({
    criteria: S.object().keys({
      challengeId: S.number(),
      keyword: S.string().optional().trim(),
      limit: S.pageSize(),
      cursor: S.string().optional().nullable(),
    }),
  })
  .fn(async criteria => {
    const { challengeId, keyword } = criteria;
    const esCriteria: any[] = [
      {
        range: {
          count: {
            gt: 0,
          },
        },
      },
    ];
    if (keyword) {
      esCriteria.push({
        prefix: {
          tag: keyword,
        },
      });
    }
    if (challengeId) {
      esCriteria.push({
        match: { challengeId },
      });
    }

    const { items, lastKey } = await esSearch(SolutionTagStatsEntity, {
      query: {
        bool: {
          must: esCriteria,
        },
      },
      sort: [
        {
          count: 'desc',
        },
        {
          _id: 'asc',
        },
      ],
      limit: criteria.limit!,
      cursor: criteria.cursor,
    });
    return {
      items: items.map(x => x.toSolutionTag()),
      cursor: lastKey,
    } as LoadMoreResult<SolutionTag>;
  });

export const searchSolutionsRpc = createRpcBinding({
  public: true,
  signature: 'solutionTags.searchSolutionTags',
  handler: searchSolutionTags,
});
