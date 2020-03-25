import * as R from 'remeda';
import { PropsOnly, DbKey } from '../types';
import { BaseEntity } from '../common/orm';
import { SubmissionStatus, Submission } from 'shared';
import { UserEntity } from './UserEntity';

export type SubmissionProps = PropsOnly<SubmissionEntity>;

export type SubmissionKey = {
  submissionId: string;
};

export type SubmissionUserKey = {
  submissionId: string;
  userId: string;
};

export type SubmissionChallengeKey = {
  submissionId: string;
  challengeId: number;
};

export type SubmissionUserChallengeKey = {
  submissionId: string;
  challengeId: number;
  userId: string;
};

export type SubmissionIndex = 'user' | 'challenge' | 'user_challenge';

/**
 * Represents a challenge submission.
 */
export class SubmissionEntity extends BaseEntity {
  submissionId!: string;
  createdAt!: number;
  challengeId!: number;
  userId!: string;
  status!: SubmissionStatus;
  result?: string;
  testUrl!: string;

  constructor(values: SubmissionProps, private indexType?: SubmissionIndex) {
    super(values, {
      createdAt: 'data_n',
    });
  }

  get key() {
    switch (this.indexType) {
      case 'user':
        return SubmissionEntity.createUserKey(this);
      case 'challenge':
        return SubmissionEntity.createChallengeKey(this);
      case 'user_challenge':
        return SubmissionEntity.createUserChallengeKey(this);
    }
    return SubmissionEntity.createKey(this);
  }

  getAllIndexes() {
    if (this.indexType) {
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

  static createKey({ submissionId }: SubmissionKey) {
    const pk = `SUBMISSION:${submissionId.toLowerCase()}`;
    return {
      pk,
      sk: pk,
    };
  }

  static createUserKey({ submissionId, userId }: SubmissionUserKey) {
    return {
      pk: `SUBMISSION_USER:${submissionId}`,
      sk: `SUBMISSION_USER:${userId}`,
    };
  }

  static createChallengeKey({
    submissionId,
    challengeId,
  }: SubmissionChallengeKey) {
    return {
      pk: `SUBMISSION_CHALLENGE:${submissionId}`,
      sk: `SUBMISSION_CHALLENGE:${challengeId}`,
    };
  }

  static createUserChallengeKey({
    challengeId,
    submissionId,
    userId,
  }: SubmissionUserChallengeKey) {
    return {
      pk: `SUBMISSION_USER_CHALLENGE:${submissionId}`,
      sk: `SUBMISSION_USER_CHALLENGE:${challengeId}:${userId}`,
    };
  }

  static isEntityKey(key: DbKey) {
    return key.pk.startsWith('SUBMISSION:');
  }
}
