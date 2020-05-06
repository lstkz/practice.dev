import { createBaseEntity } from '../lib';
import { SolutionTag } from 'shared';

export interface SolutionTagStatsKey {
  challengeId: number;
  tag: string;
}

export interface SolutionTagStatsProps extends SolutionTagStatsKey {
  count: number;
}

const BaseEntity = createBaseEntity('SolutionTagStats')
  .props<SolutionTagStatsProps>()
  .key<SolutionTagStatsKey>(
    key => `SOLUTION_TAG_STATS:${key.challengeId}:${key.tag.toLowerCase()}`
  )
  .build();

export class SolutionTagStatsEntity extends BaseEntity {
  toSolutionTag(): SolutionTag {
    return {
      count: this.count,
      name: this.tag,
    };
  }
}
