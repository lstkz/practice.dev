import { PropsOnly } from '../types';
import { BaseEntity } from '../common/orm';
import { User, PublicUser } from 'shared';

export type UserProps = PropsOnly<UserEntity>;

export type UserKey = {
  userId: string;
};

/**
 * Represents a main user entity.
 */
export class UserEntity extends BaseEntity {
  userId!: string;
  email!: string;
  username!: string;
  salt!: string;
  password!: string;
  isVerified!: boolean;
  githubId?: number;
  isAdmin?: boolean;

  constructor(values: UserProps) {
    super(values);
  }

  get key() {
    return UserEntity.createKey(this);
  }

  toUser(): User {
    return {
      id: this.userId,
      email: this.email,
      username: this.username,
      isVerified: this.isVerified,
      isAdmin: this.isAdmin,
    };
  }

  toPublicUser(): PublicUser {
    return {
      id: this.userId,
      username: this.username,
    };
  }

  static createKey({ userId }: UserKey) {
    const pk = `USER:${userId}`;
    return {
      pk,
      sk: pk,
    };
  }
}
