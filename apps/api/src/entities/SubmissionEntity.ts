import * as R from 'remeda';
import { createBaseEntity } from '../lib';
import { SubmissionStatus, Submission } from 'shared';
import { DbKey } from '../types';
import { UserEntity } from './UserEntity';
import { BaseSearchCriteria } from '../orm/types';

export type SubmissionIndex = 'user' | 'challenge' | 'user_challenge';

export interface SubmissionBaseKey {
  submissionId: string;
  __indexType?: null;
}

export interface SubmissionUserKey {
  submissionId: string;
  userId: string;
  __indexType?: 'user';
}

export interface SubmissionChallengeKey {
  submissionId: string;
  challengeId: number;
  __indexType?: 'challenge';
}

export interface SubmissionUserChallengeKey {
  submissionId: string;
  challengeId: number;
  userId: string;
  __indexType?: 'user_challenge';
}

export type SubmissionKey =
  | SubmissionBaseKey
  | SubmissionUserKey
  | SubmissionChallengeKey
  | SubmissionUserChallengeKey;

export interface SubmissionProps {
  submissionId: string;
  createdAt: number;
  challengeId: number;
  userId: string;
  status: SubmissionStatus;
  result?: string;
  testUrl: string;
}

interface SearchByUserChallengeCriteria extends BaseSearchCriteria {
  userId: string;
  challengeId: number;
}

interface SearchByUserCriteria extends BaseSearchCriteria {
  userId: string;
}

interface SearchByChallengeCriteria extends BaseSearchCriteria {
  challengeId: number;
}

const BaseEntity = createBaseEntity()
  .props<SubmissionProps>()
  .key<SubmissionKey>(key => {
    switch (key.__indexType) {
      case 'user': {
        return {
          pk: `SUBMISSION_USER:${key.submissionId}`,
          sk: `SUBMISSION_USER:${key.userId}`,
        };
      }
      case 'challenge': {
        return {
          pk: `SUBMISSION_CHALLENGE:${key.submissionId}`,
          sk: `SUBMISSION_CHALLENGE:${key.challengeId}`,
        };
      }
      case 'user_challenge': {
        return {
          pk: `SUBMISSION_USER_CHALLENGE:${key.submissionId}`,
          sk: `SUBMISSION_USER_CHALLENGE:${key.challengeId}:${key.userId}`,
        };
      }
      default: {
        return `SUBMISSION:${key.submissionId}`;
      }
    }
  })
  .mapping({
    createdAt: 'data_n',
  })
  .build();

export class SubmissionEntity extends BaseEntity {
  protected __indexType?: string;

  constructor(props: SubmissionProps, index?: SubmissionIndex) {
    super(props);
    if (index) {
      this.__indexType = index;
    }
  }

  getAllIndexes() {
    if (this.__indexType) {
      throw new Error('indexType must be not set.');
    }
    const props = this.getProps();
    return [
      new SubmissionEntity(props, 'challenge'),
      new SubmissionEntity(props, 'user'),
      new SubmissionEntity(props, 'user_challenge'),
    ];
  }

  asMainEntity() {
    const props = this.getProps();
    return new SubmissionEntity(props);
  }

  toSubmission(user: UserEntity): Submission {
    return {
      id: this.submissionId,
      challengeId: this.challengeId,
      user: user.toPublicUser(),
      status: this.status,
      createdAt: new Date(this.createdAt).toISOString(),
    };
  }

  static toSubmissionMany(items: SubmissionEntity[], users: UserEntity[]) {
    const userMap = R.indexBy(users, x => x.userId);
    return items.map(item => item.toSubmission(userMap[item.userId]));
  }

  static isEntityKey(key: DbKey) {
    return key.pk.startsWith('SUBMISSION:');
  }

  static async searchByUserChallenge(criteria: SearchByUserChallengeCriteria) {
    const { sk } = this.createKey({
      __indexType: 'user_challenge',
      challengeId: criteria.challengeId,
      userId: criteria.userId,
      submissionId: '-1',
    });
    return this._searchBySk(sk, criteria);
  }

  static async searchByUser(criteria: SearchByUserCriteria) {
    const { sk } = this.createKey({
      __indexType: 'user',
      userId: criteria.userId,
      submissionId: '-1',
    });
    return this._searchBySk(sk, criteria);
  }

  static async searchByChallenge(criteria: SearchByChallengeCriteria) {
    const { sk } = this.createKey({
      __indexType: 'challenge',
      challengeId: criteria.challengeId,
      submissionId: '-1',
    });
    return this._searchBySk(sk, criteria);
  }

  private static async _searchBySk(sk: string, criteria: BaseSearchCriteria) {
    return this.query({
      key: {
        sk,
        data_n: null,
      },
      lastKey: criteria.lastKey,
      limit: criteria.limit,
      sort: criteria.sort,
    });
  }
}
