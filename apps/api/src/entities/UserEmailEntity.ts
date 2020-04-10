import { createBaseEntity } from '../lib';

export interface UserEmailKey {
  email: string;
}

export interface UserEmailProps extends UserEmailKey {
  userId: string;
}

const BaseEntity = createBaseEntity()
  .props<UserEmailProps>()
  .key<UserEmailKey>(key => `USER_EMAIL:${key.email.toLowerCase()}`)
  .build();

export class UserEmailEntity extends BaseEntity {
  static async getIsTaken(email: string) {
    const item = await this.getByKeyOrNull({
      email,
    });
    return item != null;
  }
}
