import {
  ChallengeStats,
  ChallengeDomain,
  ChallengeDifficulty,
  Challenge,
} from 'shared';
import { createBaseEntity } from '../lib';

export interface ChallengeKey {
  challengeId: number;
}

export interface ChallengeProps extends ChallengeKey {
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

const BaseEntity = createBaseEntity('Challenge')
  .props<ChallengeProps>()
  .key<ChallengeKey>(key => ({
    pk: `CHALLENGE:${key.challengeId}`,
    sk: 'CHALLENGE',
  }))
  .mapping({
    challengeId: 'data_n',
  })
  .build();

export class ChallengeEntity extends BaseEntity {
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

  static getAll() {
    return this.queryAll({
      key: {
        sk: 'CHALLENGE',
        data_n: null,
      },
      sort: 'asc',
    });
  }
}
