import * as R from 'remeda';
import { createBaseEntity } from '../lib';
import { UserEntity } from './UserEntity';
import { SolutionVoteEntity } from './SolutionVoteEntity';
import { DbKey } from '../types';

export type SolutionIndex =
  | { type: 'user' }
  | { type: 'user_challenge' }
  | { type: 'slug' }
  | {
      type: 'tag';
      tag: string;
    };

export interface SolutionBaseKey {
  solutionId: string;
  challengeId: number;
  __indexType?: null;
}

export interface SolutionUserKey {
  solutionId: string;
  userId: string;
  __indexType: 'user';
}

export interface SolutionChallengeUserKey {
  solutionId: string;
  userId: string;
  challengeId: number;
  __indexType: 'user_challenge';
}

export interface SolutionSlugKey {
  challengeId: number;
  slug: string;
  __indexType: 'slug';
}

export interface SolutionTagKey {
  challengeId: number;
  solutionId: string;
  tag: string;
  __indexType: 'tag';
  __indexTag: string;
}

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
}

export type SolutionKey =
  | SolutionBaseKey
  | SolutionUserKey
  | SolutionChallengeUserKey
  | SolutionSlugKey
  | SolutionTagKey;

const BaseEntity = createBaseEntity()
  .props<SolutionProps>()
  .key<SolutionKey>(key => {
    switch (key.__indexType) {
      case 'user':
        return {
          pk: `SOLUTION_USER:${key.solutionId}`,
          sk: `SOLUTION_USER:${key.userId}`,
        };
      case 'user_challenge':
        return {
          pk: `SOLUTION_CHALLENGE_USER:${key.solutionId}`,
          sk: `SOLUTION_CHALLENGE_USER:${key.userId}:${key.challengeId}`,
        };
      case 'slug':
        return `SOLUTION_SLUG:${key.challengeId}:${key.slug}`;
      case 'tag':
        return {
          pk: `SOLUTION_TAG:${key.solutionId}`,
          sk: `SOLUTION_TAG:${key.challengeId}:${key.__indexTag}`,
        };
      default: {
        return {
          pk: `SOLUTION:${key.solutionId}`,
          sk: `SOLUTION:${key.challengeId}`,
        };
      }
    }
  })
  .mapping({
    likes: 'data2_n',
    createdAt: 'data_n',
  })
  .build();

export class SolutionEntity extends BaseEntity {
  protected __indexType?: string;
  protected __indexTag?: string;

  constructor(props: SolutionProps, index?: SolutionIndex) {
    super(props);
    if (index) {
      this.__indexType = index.type;
      if ('tag' in index) {
        this.__indexTag = index.tag;
      }
    }
  }

  getAllIndexes() {
    if (this.__indexType) {
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

  asSlugEntity() {
    const props = this.getProps();
    return new SolutionEntity(props, { type: 'slug' });
  }
  asTagEntity(tag: string) {
    const props = this.getProps();
    return new SolutionEntity(props, {
      tag,
      type: 'tag',
    });
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
