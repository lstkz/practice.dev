import * as R from 'remeda';
import { createBaseEntity } from '../lib';
import { DbKey } from '../types';
import { ChallengeSolved } from 'shared';
import { UserEntity } from './UserEntity';

export interface ChallengeSolvedKey {
  userId: string;
  challengeId: number;
}

export interface ChallengeSolvedProps extends ChallengeSolvedKey {
  solvedAt: number;
}

const BaseEntity = createBaseEntity()
  .props<ChallengeSolvedProps>()
  .key<ChallengeSolvedKey>(key => ({
    pk: `CHALLENGE_SOLVED:${key.userId}`,
    sk: `CHALLENGE_SOLVED:${key.challengeId}`,
  }))
  .mapping({
    solvedAt: 'data_n',
  })
  .build();

export class ChallengeSolvedEntity extends BaseEntity {
  toChallengeSolved(user: UserEntity): ChallengeSolved {
    return {
      challengeId: this.challengeId,
      solvedAt: this.solvedAt,
      user: user.toPublicUser(),
    };
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

  static isEntityKey(key: DbKey) {
    return key.pk.startsWith('CHALLENGE_SOLVED:');
  }
}
