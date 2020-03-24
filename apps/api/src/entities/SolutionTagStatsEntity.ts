import { PropsOnly } from '../types';
import { BaseEntity } from '../common/orm';
import { SolutionTag } from 'shared';

export type SolutionTagStatsProps = PropsOnly<SolutionTagStatsEntity>;

export type SolutionTagStatsKey = {
  challengeId: number;
  tag: string;
};

/**
 * Represents a solution tag stats.
 */
export class SolutionTagStatsEntity extends BaseEntity {
  challengeId!: number;
  count!: number;
  tag!: string;

  constructor(values: SolutionTagStatsProps) {
    super(values, {
      tag: 'data',
    });
  }

  get key() {
    return SolutionTagStatsEntity.createKey(this);
  }

  toSolutionTag(): SolutionTag {
    return {
      count: this.count,
      name: this.tag,
    };
  }

  static createKey({ challengeId, tag }: SolutionTagStatsKey) {
    return {
      pk: `SOLUTION_TAG_STATS:${challengeId}:${tag.toLowerCase()}`,
      sk: `SOLUTION_TAG_STATS:${challengeId}`,
    };
  }
}
