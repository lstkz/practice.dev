import { PropsOnly, DbKey } from '../types';
import { BaseEntity } from '../common/orm';

export type SolutionProps = PropsOnly<SolutionEntity>;

export type SolutionKey = {
  solutionId: string;
  challengeId: number;
};

/**
 * Represents a solution.
 */
export class SolutionEntity extends BaseEntity {
  solutionId!: string;
  description?: string;
  challengeId!: number;
  userId!: string;
  title!: string;
  slug!: string;
  url!: string;
  tags!: string[];
  likes!: number;
  createdAt!: number;

  constructor(values: SolutionProps) {
    super(values, {
      likes: 'data2_n',
      createdAt: 'data_n',
    });
  }

  get key() {
    return SolutionEntity.createKey(this);
  }

  static createKey({ solutionId, challengeId }: SolutionKey) {
    return {
      pk: `SOLUTION:${solutionId}`,
      sk: `SOLUTION:${challengeId}`,
    };
  }

  static isEntityKey(key: DbKey) {
    return key.pk.startsWith('SOLUTION:');
  }
}
