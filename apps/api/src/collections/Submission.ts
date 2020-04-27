import { createCollection } from '../db';
import { SubmissionStatus } from 'shared';

export interface SubmissionModel {
  _id: number;
  createdAt: Date;
  challengeId: number;
  userId: number;
  status: SubmissionStatus;
  result?: string;
  testUrl: string;
}

export const SubmissionCollection = createCollection<SubmissionModel>(
  'submission',
  [
    {
      key: {
        challengeId: 1,
      },
    },
    {
      key: {
        userId: 1,
      },
    },
    {
      key: {
        challengeId: 1,
        userId: 1,
      },
    },
  ]
);
