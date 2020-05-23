import * as R from 'remeda';
import { createBaseEntity } from '../lib';
import { SubmissionStatus, Submission, ChallengeSource } from 'shared';
import { UserEntity } from './UserEntity';

export interface SubmissionKey {
  submissionId: string;
}

export interface SubmissionProps {
  submissionId: string;
  createdAt: number;
  challengeId: number;
  projectId?: number;
  userId: string;
  status: SubmissionStatus;
  result?: string;
  testUrl: string;
  type: ChallengeSource;
}

const BaseEntity = createBaseEntity('Submission')
  .props<SubmissionProps>()
  .key<SubmissionKey>(key => `SUBMISSION:${key.submissionId}`)
  .build();

export class SubmissionEntity extends BaseEntity {
  toSubmission(user: UserEntity): Submission {
    return {
      id: this.submissionId,
      challengeId: this.challengeId,
      projectId: this.projectId,
      user: user.toPublicUser(),
      status: this.status,
      createdAt: new Date(this.createdAt).toISOString(),
      type: this.type,
    };
  }

  static toSubmissionMany(items: SubmissionEntity[], users: UserEntity[]) {
    const userMap = R.indexBy(users, x => x.userId);
    return items.map(item => item.toSubmission(userMap[item.userId]));
  }
}
