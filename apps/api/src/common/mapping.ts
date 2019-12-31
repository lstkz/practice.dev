import { DbUser, DbChallenge } from '../types';
import { User, Challenge } from 'shared';

export function mapDbUser(dbUser: DbUser): User {
  return {
    id: dbUser.userId,
    email: dbUser.email,
    username: dbUser.username,
    isVerified: dbUser.isVerified,
  };
}

export function mapDbChallenge(
  dbChallenge: DbChallenge,
  isSolved = false
): Challenge {
  return {
    id: dbChallenge.data_n,
    title: dbChallenge.title,
    description: dbChallenge.description,
    bundle: dbChallenge.bundle,
    tags: dbChallenge.tags,
    isSolved,
    createdAt: new Date(dbChallenge.createdAt).toISOString(),
    stats: dbChallenge.stats,
    difficulty: dbChallenge.difficulty,
    domain: dbChallenge.domain,
  };
}
