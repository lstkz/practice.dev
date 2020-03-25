import { PropsOnly } from '../types';
import { BaseEntity } from '../common/orm';
import {
  ChallengeStats,
  ChallengeDomain,
  ChallengeDifficulty,
  Challenge,
} from 'shared';

export type ChallengeProps = PropsOnly<ChallengeEntity>;

export type ChallengeKey = {
  challengeId: number;
};

/**
 * Represents a challenge.
 */
export class ChallengeEntity extends BaseEntity {
  challengeId!: number;
  title!: string;
  description!: string;
  domain!: ChallengeDomain;
  difficulty!: ChallengeDifficulty;
  detailsBundleS3Key!: string;
  testsBundleS3Key!: string;
  createdAt!: number;
  tags!: string[];
  stats!: ChallengeStats;
  testCase!: string;

  constructor(values: ChallengeProps) {
    super(values, {
      challengeId: 'data_n',
    });
  }

  get key() {
    return ChallengeEntity.createKey(this);
  }

  toChallenge(isSolved = false): Challenge {
    return {
      id: this.challengeId,
      title: this.title,
      description: this.description,
      detailsBundleS3Key: this.detailsBundleS3Key,
      testCase: this.testCase,
      tags: this.tags,
      isSolved,
      createdAt: new Date(this.createdAt).toISOString(),
      stats: this.stats,
      difficulty: this.difficulty,
      domain: this.domain,
    };
  }

  static createKey({ challengeId }: ChallengeKey) {
    return {
      pk: `CHALLENGE:${challengeId}`,
      sk: 'CHALLENGE',
    };
  }
}
