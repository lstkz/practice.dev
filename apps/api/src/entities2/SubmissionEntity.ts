import { createBaseEntity } from '../lib';
import { SubmissionStatus } from 'shared';
import { DbKey } from '../types';

export interface SubmissionKey {
  submissionId: string;
}

export interface SubmissionProps {
  submissionId: string;
  createdAt: number;
  challengeId: number;
  userId: string;
  status: SubmissionStatus;
  result?: string;
  testUrl: string;
}

const BaseEntity = createBaseEntity()
  .props<SubmissionProps>()
  .key<SubmissionKey>(key => `SUBMISSION:${key.submissionId.toLowerCase()}`)
  .build();

export class SubmissionEntity extends BaseEntity {
  static isEntityKey(key: DbKey) {
    return key.pk.startsWith('SUBMISSION:');
  }
}
