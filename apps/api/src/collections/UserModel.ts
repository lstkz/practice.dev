import { createCollection } from '../db';

export interface UserModel {
  _id: number;
  email: string;
  email_lowered: string;
  username: string;
  username_lowered: string;
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
  stats: {
    solutions: number;
    likes: number;
    followers: number;
    following: number;
    submissions: number;
  };
}

export const UserCollection = createCollection<UserModel>('user', [
  {
    key: {
      email_lowered: 1,
    },
    unique: true,
  },
  {
    key: {
      username_lowered: 1,
    },
    unique: true,
  },
  {
    key: {
      githubId: 1,
    },
    partialFilterExpression: { githubId: { $exists: true } },
    unique: true,
  },
]);
