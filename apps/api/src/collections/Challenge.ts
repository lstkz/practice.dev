import { ChallengeStats, ChallengeDomain, ChallengeDifficulty } from 'shared';
import { createCollection } from '../db';

export interface ChallengeModel {
  _id: number;
  title: string;
  description: string;
  domain: ChallengeDomain;
  difficulty: ChallengeDifficulty;
  detailsBundleS3Key: string;
  testsBundleS3Key: string;
  createdAt: number;
  tags: string[];
  stats: ChallengeStats;
  testCase: string;
}

export const ChallengeCollection = createCollection<ChallengeModel>(
  'challenge'
);
