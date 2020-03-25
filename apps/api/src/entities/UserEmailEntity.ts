import { PropsOnly } from '../types';
import { BaseEntity } from '../common/orm';

export type UserEmailProps = PropsOnly<UserEmailEntity>;

export type UserEmailKey = {
  email: string;
};

/**
 * Represents a unique constrains on user email.
 */
export class UserEmailEntity extends BaseEntity {
  userId!: string;
  email!: string;

  constructor(values: UserEmailProps) {
    super(values);
  }

  get key() {
    return UserEmailEntity.createKey(this);
  }

  static createKey({ email }: UserEmailKey) {
    const pk = `USER_EMAIL:${email.toLowerCase()}`;
    return {
      pk,
      sk: pk,
    };
  }
}
