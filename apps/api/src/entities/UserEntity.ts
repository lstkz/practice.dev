import * as R from 'remeda';
import { createBaseEntity } from '../lib';
import { User, PublicUser, PublicUserProfile } from 'shared';
import { UserEmailEntity } from './UserEmailEntity';
import { UserUsernameEntity } from './UserUsernameEntity';

export interface UserKey {
  userId: string;
}

export interface UserStats {
  solutions: number;
  likes: number;
  solved: number;
  followers: number;
  following: number;
  submissions: number;
}

export interface UserProps extends UserKey {
  email: string;
  username: string;
  country?: string;
  salt: string;
  password: string;
  isVerified: boolean;
  githubId?: number;
  isAdmin?: boolean;
  name?: string;
  url?: string;
  avatarUrl?: string;
  bio?: string;
  stats: UserStats;
}

const BaseEntity = createBaseEntity('User')
  .props<UserProps>()
  .key<UserKey>(key => `USER:${key.userId}`)
  .build();

export class UserEntity extends BaseEntity {
  constructor(props: UserProps) {
    if (!props.stats) {
      props.stats = {
        solutions: 0,
        solved: 0,
        likes: 0,
        followers: 0,
        following: 0,
        submissions: 0,
      };
    }
    super(props);
  }

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

  static getByIds(ids: string[]) {
    if (!ids.length) {
      return [];
    }
    const keys = R.uniq(ids).map(userId => ({ userId }));
    return this.batchGet(keys);
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

  toPublicUserProfile(isFollowed: boolean): PublicUserProfile {
    return {
      id: this.userId,
      username: this.username,
      country: this.country ?? null,
      avatarUrl: this.avatarUrl ?? null,
      name: this.name ?? '',
      url: this.url ?? '',
      bio: this.bio ?? '',
      isFollowed,
      submissionsCount: this.stats.submissions,
      solutionsCount: this.stats.solutions,
      likesCount: this.stats.likes,
      followersCount: this.stats.followers,
      followingCount: this.stats.following,
    };
  }
}
