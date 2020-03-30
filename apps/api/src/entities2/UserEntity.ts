import { createBaseEntity } from '../lib';
import { User, PublicUser } from 'shared';

export interface UserKey {
  userId: string;
}

export interface UserProps extends UserKey {
  email: string;
  username: string;
  salt: string;
  password: string;
  isVerified: boolean;
  githubId?: number;
  isAdmin?: boolean;
}

const BaseEntity = createBaseEntity()
  .props<UserProps>()
  .key<UserKey>(key => `USER:${key.userId}`)
  .build();

export class UserEntity extends BaseEntity {
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
}
