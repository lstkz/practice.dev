import * as R from 'remeda';
import { createBaseEntity } from '../lib';
import { UserEntity } from './UserEntity';
import { SolutionVoteEntity } from './SolutionVoteEntity';
import { DbKey } from '../types';
import { DynamoKey, QueryKey, BaseSearchCriteria } from '../orm/types';

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

export interface BaseSolutionSearchCriteria extends BaseSearchCriteria {
  sortBy: 'date' | 'likes';
}

interface SearchByChallengeUserCriteria extends BaseSolutionSearchCriteria {
  userId: string;
  challengeId: number;
}

interface SearchByUserCriteria extends BaseSolutionSearchCriteria {
  userId: string;
}

interface SearchByChallengeCriteria extends BaseSolutionSearchCriteria {
  challengeId: number;
}

interface SearchByTagsCriteria extends BaseSolutionSearchCriteria {
  challengeId: number;
  tags: string[];
  userId?: string | null;
}

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

  static async getByIdOrNull(id: string) {
    const ret = await this.queryAll({
      key: {
        pk: `SOLUTION:${id}`,
      },
      sort: 'asc',
    });
    return ret.length ? ret[0] : null;
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

  static async searchByChallengeUser(criteria: SearchByChallengeUserCriteria) {
    return this.query({
      key: _getKey(
        this.createKey({
          __indexType: 'user_challenge',
          solutionId: '-1',
          challengeId: criteria.challengeId,
          userId: criteria.userId,
        }).sk,
        criteria.sortBy
      ),
      lastKey: criteria.lastKey,
      limit: criteria.limit,
      sort: criteria.sort,
    });
  }

  static async searchByUser(criteria: SearchByUserCriteria) {
    return this.query({
      key: _getKey(
        this.createKey({
          __indexType: 'user',
          solutionId: '-1',
          userId: criteria.userId,
        }).sk,
        criteria.sortBy
      ),
      lastKey: criteria.lastKey,
      limit: criteria.limit,
      sort: criteria.sort,
    });
  }

  static async searchByChallenge(criteria: SearchByChallengeCriteria) {
    return this.query({
      key: _getKey(
        this.createKey({
          challengeId: criteria.challengeId,
          solutionId: '-1',
        }).sk,
        criteria.sortBy
      ),
      lastKey: criteria.lastKey,
      limit: criteria.limit,
      sort: criteria.sort,
    });
  }

  static async searchByTags(criteria: SearchByTagsCriteria) {
    const [first, ...restTags] = criteria.tags;
    const filter = _createSolutionFilter(criteria.userId, restTags);
    return this.query({
      key: _getKey(
        this.createKey({
          __indexType: 'tag',
          __indexTag: first,
          solutionId: '-1',
          challengeId: criteria.challengeId,
        }).sk,
        criteria.sortBy
      ),
      lastKey: criteria.lastKey,
      limit: criteria.limit,
      sort: criteria.sort,
      ...filter,
    });
  }
}

function _getKey(sk: string, sortBy: 'date' | 'likes'): QueryKey {
  if (sortBy === 'date') {
    return { sk, data_n: null };
  }
  return { sk, data2_n: null };
}

function _createSolutionFilter(
  userId: string | undefined | null,
  tags: string[] | undefined | null
) {
  const conditions: string[] = [];
  const values: { [key: string]: any } = {};
  if (userId) {
    conditions.push(`userId = :f_userId`);
    values[':f_userId'] = userId;
  }
  if (tags?.length) {
    tags.forEach((tag, i) => {
      conditions.push(`contains(tags, :f_tag_${i})`);
      values[`:f_tag_${i}`] = tag;
    });
  }

  if (!conditions.length) {
    return {
      expressionValues: {},
    };
  }

  return {
    filterExpression: conditions.join(' AND '),
    expressionValues: values,
  };
}
