import * as R from 'remeda';
import { PropsOnly, DbKey } from '../types';
import { BaseEntity } from '../common/orm';
import { UserEntity } from './UserEntity';
import { ChallengeSolved } from 'shared';

export type ChallengeSolvedProps = PropsOnly<ChallengeSolvedEntity>;

export type ChallengeSolvedKey = {
  userId: string;
  challengeId: number;
};

/**
 * Represents a solved challenge by the user.
 */
export class ChallengeSolvedEntity extends BaseEntity {
  challengeId!: number;
  userId!: string;
  solvedAt!: number;

  constructor(values: ChallengeSolvedProps) {
    super(values, {
      solvedAt: 'data_n',
    });
  }

  get key() {
    return ChallengeSolvedEntity.createKey(this);
  }

  toChallengeSolved(user: UserEntity): ChallengeSolved {
    return {
      challengeId: this.challengeId,
      solvedAt: this.solvedAt,
      user: user.toPublicUser(),
    };
  }

  static toChallengeSolvedMany(
    items: ChallengeSolvedEntity[],
    users: UserEntity[]
  ) {
    const userMap = R.indexBy(users, x => x.userId);
    return items.map(item => item.toChallengeSolved(userMap[item.userId]));
  }

  static createKey({ userId, challengeId }: ChallengeSolvedKey) {
    return {
      pk: `CHALLENGE_SOLVED:${userId}`,
      sk: `CHALLENGE_SOLVED:${challengeId}`,
    };
  }

  static isEntityKey(key: DbKey) {
    return key.pk.startsWith('CHALLENGE_SOLVED:');
  }
}
