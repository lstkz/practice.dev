import * as R from 'remeda';
import { PropsOnly, DbKey } from '../types';
import { BaseEntity } from '../common/orm';
import { UserEntity } from './UserEntity';
import { SolutionVoteEntity } from './SolutionVoteEntity';

export type SolutionProps = PropsOnly<SolutionEntity>;

export type SolutionKey = {
  solutionId: string;
  challengeId: number;
};

export type SolutionUserKey = {
  solutionId: string;
  userId: string;
};

export type SolutionChallengeUserKey = {
  solutionId: string;
  userId: string;
  challengeId: number;
};

export type SolutionSlugKey = {
  challengeId: number;
  slug: string;
};

export type SolutionTagKey = {
  challengeId: number;
  solutionId: string;
  tag: string;
};

export type SolutionIndex =
  | { type: 'user' }
  | { type: 'user_challenge' }
  | { type: 'slug' }
  | {
      type: 'tag';
      tag: string;
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

  constructor(values: SolutionProps, private indexType?: SolutionIndex) {
    super(values, {
      likes: 'data2_n',
      createdAt: 'data_n',
    });
  }

  get key() {
    switch (this.indexType?.type) {
      case 'user':
        return SolutionEntity.createUserKey(this);
      case 'user_challenge':
        return SolutionEntity.createChallengeUserKey(this);
      case 'slug':
        return SolutionEntity.createSlugKey(this);
      case 'tag':
        return SolutionEntity.createTagKey({
          challengeId: this.challengeId,
          solutionId: this.solutionId,
          tag: this.indexType.tag,
        });
    }
    return SolutionEntity.createKey(this);
  }

  toSolution(user: UserEntity, vote?: SolutionVoteEntity | null) {
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

  getAllIndexes() {
    if (this.indexType) {
      throw new Error('indexType must be not set.');
    }
    const props = this.getProps();
    return [
      new SolutionEntity(props, { type: 'user' }),
      new SolutionEntity(props, { type: 'user_challenge' }),
      new SolutionEntity(props, { type: 'slug' }),
      ...this.tags.map(
        tag =>
          new SolutionEntity(props, {
            type: 'tag',
            tag,
          })
      ),
    ];
  }

  asMainEntity() {
    const props = this.getProps();
    return new SolutionEntity(props);
  }

  asTagEntity(tag: string) {
    const props = this.getProps();
    return new SolutionEntity(props, {
      tag,
      type: 'tag',
    });
  }

  asSlugEntity() {
    const props = this.getProps();
    return new SolutionEntity(props, { type: 'slug' });
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

  static createKey({ solutionId, challengeId }: SolutionKey) {
    return {
      pk: `SOLUTION:${solutionId}`,
      sk: `SOLUTION:${challengeId}`,
    };
  }

  static createUserKey({ solutionId, userId }: SolutionUserKey) {
    return {
      pk: `SOLUTION_USER:${solutionId}`,
      sk: `SOLUTION_USER:${userId}`,
    };
  }
  static createTagKey({ challengeId, solutionId, tag }: SolutionTagKey) {
    return {
      pk: `SOLUTION_TAG:${solutionId}`,
      sk: `SOLUTION_TAG:${challengeId}:${tag}`,
    };
  }

  static createChallengeUserKey({
    solutionId,
    userId,
    challengeId,
  }: SolutionChallengeUserKey) {
    return {
      pk: `SOLUTION_CHALLENGE_USER:${solutionId}`,
      sk: `SOLUTION_CHALLENGE_USER:${userId}:${challengeId}`,
    };
  }
  static createSlugKey({ slug, challengeId }: SolutionSlugKey) {
    const pk = `SOLUTION_SLUG:${challengeId}:${slug}`;
    return {
      pk,
      sk: pk,
    };
  }

  static isEntityKey(key: DbKey) {
    return key.pk.startsWith('SOLUTION:');
  }
}
