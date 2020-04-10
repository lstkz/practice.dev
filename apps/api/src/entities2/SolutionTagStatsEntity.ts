import { createBaseEntity } from '../lib';
import { SolutionTag } from 'shared';
import { BaseSearchCriteria } from '../orm/types';

export interface SolutionTagStatsKey {
  challengeId: number;
  tag: string;
}

export interface SolutionTagStatsProps extends SolutionTagStatsKey {
  count: number;
}

interface SearchSolutionTagsCriteria extends BaseSearchCriteria {
  keyword?: string;
  challengeId: number;
}

const BaseEntity = createBaseEntity()
  .props<SolutionTagStatsProps>()
  .key<SolutionTagStatsKey>(key => ({
    pk: `SOLUTION_TAG_STATS:${key.challengeId}:${key.tag.toLowerCase()}`,
    sk: `SOLUTION_TAG_STATS:${key.challengeId}`,
  }))
  .mapping({
    tag: 'data',
  })
  .build();

export class SolutionTagStatsEntity extends BaseEntity {
  toSolutionTag(): SolutionTag {
    return {
      count: this.count,
      name: this.tag,
    };
  }

  static async searchSolutionTags(criteria: SearchSolutionTagsCriteria) {
    const { sk } = SolutionTagStatsEntity.createKey({
      tag: '',
      challengeId: criteria.challengeId,
    });
    return this.query({
      key: {
        sk,
        data: criteria.keyword ? ['begins_with', criteria.keyword] : null,
      },
      filterExpression: '#count > :min',
      expressionValues: {
        ':min': 0,
        ':sk': sk,
      },
      expressionNames: {
        '#count': 'count',
      },
      sort: criteria.sort,
      limit: criteria.limit,
      lastKey: criteria.lastKey,
    });
  }
}
