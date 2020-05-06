import * as R from 'remeda';
import { createBaseEntity } from '../lib';
import { UserEntity } from './UserEntity';
import { SolutionVoteEntity } from './SolutionVoteEntity';
import { DbKey } from '../types';
import { Solution } from 'shared';

export interface SolutionProps {
  solutionId: string;
  description?: string;
  challengeId: number;
  userId: string;
  title: string;
  slug: string;
  url: string;
  tags: string[];
  likes: number;
  createdAt: number;
  version?: number;
}

export interface SolutionKey {
  solutionId: string;
}

const BaseEntity = createBaseEntity('Solution')
  .props<SolutionProps>()
  .key<SolutionKey>(key => `SOLUTION:${key.solutionId}`)
  .build();

export class SolutionEntity extends BaseEntity {
  constructor(props: SolutionProps) {
    super(props);
    if (!this.version) {
      this.version = 1;
    }
  }

  toSolution(user: UserEntity, vote?: SolutionVoteEntity | null): Solution {
    return {
      id: this.solutionId,
      challengeId: this.challengeId,
      title: this.title,
      description: this.description,
      slug: this.slug,
      url: this.url,
      createdAt: new Date(this.createdAt).toISOString(),
      likes: this.likes,
      tags: this.tags,
      user: user.toPublicUser(),
      isLiked: !!vote,
    };
  }

  static toSolutionMany(
    solutions: SolutionEntity[],
    users: UserEntity[],
    votes: SolutionVoteEntity[]
  ) {
    const userMap = R.indexBy(users, x => x.userId);
    const voteMap = R.indexBy(votes, x => x.solutionId);
    return solutions.map(solution =>
      solution.toSolution(
        userMap[solution.userId],
        voteMap[solution.solutionId]
      )
    );
  }
  static isEntityKey(key: DbKey) {
    return key.pk.startsWith('SOLUTION:');
  }
}
