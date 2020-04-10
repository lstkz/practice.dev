import { createBaseEntity } from '../lib';
import { User, PublicUser } from 'shared';
import { UserEmailEntity } from './UserEmailEntity';
import { UserUsernameEntity } from './UserUsernameEntity';

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
  static async getUserIdByEmailOrUsernameOrNull(emailOrUsername: string) {
    if (emailOrUsername.includes('@')) {
      const item = await UserEmailEntity.getByKeyOrNull({
        email: emailOrUsername,
      });
      return item?.userId;
    } else {
      const item = await UserUsernameEntity.getByKeyOrNull({
        username: emailOrUsername,
      });
      return item?.userId;
    }
  }
  static async getUserByEmailOrUsernameOrNull(emailOrUsername: string) {
    const userId = await this.getUserIdByEmailOrUsernameOrNull(emailOrUsername);
    if (!userId) {
      return null;
    }
    return this.getById(userId);
  }
  static async getUserIdUsernameOrNull(emailOrUsername: string) {
    if (emailOrUsername.includes('@')) {
      const item = await UserEmailEntity.getByKeyOrNull({
        email: emailOrUsername,
      });
      return item?.userId;
    } else {
      const item = await UserUsernameEntity.getByKeyOrNull({
        username: emailOrUsername,
      });
      return item?.userId;
    }
  }

  static getByIdOrNull(userId: string) {
    return this.getByKeyOrNull({ userId });
  }

  static getById(userId: string) {
    return this.getByKey({ userId });
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
}
