import { PropsOnly, DbKey } from '../types';
import { BaseEntity } from '../common/orm';

export type SolutionVoteProps = PropsOnly<SolutionVoteEntity>;

export type SolutionVoteKey = {
  solutionId: string;
  userId: string;
};

/**
 * Represents a vote on the solution by user.
 */
export class SolutionVoteEntity extends BaseEntity {
  challengeId!: number;
  solutionId!: string;
  userId!: string;
  createdAt!: number;

  constructor(values: SolutionVoteProps) {
    super(values, {
      createdAt: 'data_n',
    });
  }

  get key() {
    return SolutionVoteEntity.createKey(this);
  }

  static createKey({ solutionId, userId }: SolutionVoteKey) {
    return {
      pk: `SOLUTION_VOTE:${solutionId}:${userId}`,
      sk: `SOLUTION_VOTE:${userId}`,
    };
  }

  static isEntityKey(key: DbKey) {
    return key.pk.startsWith('SOLUTION_VOTE:');
  }
}
