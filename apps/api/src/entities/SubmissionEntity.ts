import { PropsOnly, DbKey } from '../types';
import { BaseEntity } from '../common/orm';
import { SubmissionStatus } from 'shared';

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

  colMapping = {
    createdAt: 'data_n',
  };

  constructor(values: SubmissionProps, private indexType?: SubmissionIndex) {
    super(values);
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
