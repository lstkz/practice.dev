import { createBaseEntity } from '../lib';

export interface UserUsernameKey {
  username: string;
}

export interface UserUsernameProps extends UserUsernameKey {
  userId: string;
}

const BaseEntity = createBaseEntity('UserUsername')
  .props<UserUsernameProps>()
  .key<UserUsernameKey>(key => `USER_USERNAME:${key.username.toLowerCase()}`)
  .build();

export class UserUsernameEntity extends BaseEntity {
  static async getIsTaken(username: string) {
    const item = await this.getByKeyOrNull({
      username,
    });
    return item != null;
  }

  static async getUserIdOrNull(username: string) {
    const ret = await UserUsernameEntity.getByKeyOrNull({
      username,
    });
    return ret?.userId;
  }
}
