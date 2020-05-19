import * as R from 'remeda';
import { createBaseEntity } from '../lib';
import { ChallengeSolved } from 'shared';
import { UserEntity } from './UserEntity';

export interface ChallengeSolvedKey {
  userId: string;
  challengeId: number;
}

export interface ChallengeSolvedProps extends ChallengeSolvedKey {
  solvedAt: number;
}

const BaseEntity = createBaseEntity('ChallengeSolved')
  .props<ChallengeSolvedProps>()
  .key<ChallengeSolvedKey>(key => ({
    pk: `CHALLENGE_SOLVED:${key.userId}`,
    sk: `CHALLENGE_SOLVED:${key.challengeId}:${key.userId}`,
  }))
  .build();

export class ChallengeSolvedEntity extends BaseEntity {
  toChallengeSolved(user: UserEntity): ChallengeSolved {
    return {
      challengeId: this.challengeId,
      solvedAt: this.solvedAt,
      user: user.toPublicUser(),
    };
  }

  static async getSolvedChallengeIds(userId: string | undefined) {
    if (!userId) {
      return [];
    }
    const items = await this.queryAll({
      key: {
        pk: `CHALLENGE_SOLVED:${userId}`,
      },
      sort: 'asc',
    });
    return items.map(item => item.challengeId);
  }

  static async getIsSolved(userId: string | undefined, challengeId: number) {
    if (!userId) {
      return false;
    }
    const solved = await this.getByKeyOrNull({
      challengeId,
      userId,
    });
    return solved != null;
  }

  static toChallengeSolvedMany(
    items: ChallengeSolvedEntity[],
    users: UserEntity[]
  ) {
    const userMap = R.indexBy(users, x => x.userId);
    return items.map(item => item.toChallengeSolved(userMap[item.userId]));
  }
}
