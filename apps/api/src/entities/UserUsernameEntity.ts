import { PropsOnly } from '../types';
import { BaseEntity } from '../common/orm';

export type UserUsernameProps = PropsOnly<UserUsernameEntity>;

export type UserUsernameKey = {
  username: string;
};

/**
 * Represents a unique constrains on user username.
 */
export class UserUsernameEntity extends BaseEntity {
  userId!: string;
  username!: string;

  constructor(values: UserUsernameProps) {
    super(values);
  }

  get key() {
    return UserUsernameEntity.createKey(this);
  }

  static createKey({ username }: UserUsernameKey) {
    const pk = `USER_USERNAME:${username.toLowerCase()}`;
    return {
      pk,
      sk: pk,
    };
  }
}
