import { createBaseEntity } from '../lib';
import { DbKey } from '../types';

export interface SolutionVoteKey {
  solutionId: string;
  userId: string;
}

export interface SolutionVoteProps extends SolutionVoteKey {
  challengeId: number;
  createdAt: number;
}

const BaseEntity = createBaseEntity()
  .props<SolutionVoteProps>()
  .key<SolutionVoteKey>(key => ({
    pk: `SOLUTION_VOTE:${key.solutionId}:${key.userId}`,
    sk: `SOLUTION_VOTE:${key.userId}`,
  }))
  .build();

export class SolutionVoteEntity extends BaseEntity {
  static isEntityKey(key: DbKey) {
    return key.pk.startsWith('SOLUTION_VOTE:');
  }
}
