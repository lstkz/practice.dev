import { createBaseEntity } from '../lib';
import { DbKey } from '../types';
import { SolutionEntity } from './SolutionEntity';

export interface SolutionVoteKey {
  solutionId: string;
  userId: string;
}

export interface SolutionVoteProps extends SolutionVoteKey {
  challengeId: number;
  createdAt: number;
}

const BaseEntity = createBaseEntity('SolutionVote')
  .props<SolutionVoteProps>()
  .key<SolutionVoteKey>(key => ({
    pk: `SOLUTION_VOTE:${key.solutionId}:${key.userId}`,
    sk: `SOLUTION_VOTE:${key.userId}`,
  }))
  .mapping({
    createdAt: 'data_n',
  })
  .build();

export class SolutionVoteEntity extends BaseEntity {
  static isEntityKey(key: DbKey) {
    return key.pk.startsWith('SOLUTION_VOTE:');
  }

  static async getUserSolutionVotes(
    userId: string | undefined,
    solutions: SolutionEntity[]
  ) {
    if (!userId || !solutions.length) {
      return [] as SolutionVoteEntity[];
    }
    return this.queryAll({
      key: {
        sk: this.createKey({ solutionId: '-1', userId }).sk,
        data_n: null,
      },
      sort: 'asc',
      filterExpression: `solutionId IN (${solutions
        .map((_, i) => `:s${i}`)
        .join(',')})`,
      expressionValues: solutions.reduce((ret, solution, i) => {
        ret[`:s${i}`] = solution.solutionId;
        return ret;
      }, {} as Record<string, any>),
    });
  }
}
