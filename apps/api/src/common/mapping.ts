import * as R from 'remeda';
import { DbUser, DbChallenge, DbSolution, DbChallengeSolved } from '../types';
import { User, Challenge, Solution, ChallengeSolved } from 'shared';

export function mapDbUser(item: DbUser): User {
  return {
    id: item.userId,
    email: item.email,
    username: item.username,
    isVerified: item.isVerified,
  };
}

export function mapDbChallenge(item: DbChallenge, isSolved = false): Challenge {
  return {
    id: item.data_n,
    title: item.title,
    description: item.description,
    bundle: item.bundle,
    tags: item.tags,
    isSolved,
    createdAt: new Date(item.createdAt).toISOString(),
    stats: item.stats,
    difficulty: item.difficulty,
    domain: item.domain,
  };
}

export function mapDbSolution(item: DbSolution, user: DbUser): Solution {
  return {
    id: item.solutionId,
    title: item.title,
    description: item.description,
    slug: item.slug,
    createdAt: new Date(item.data_n).toISOString(),
    likes: item.data2_n,
    tags: item.tags,
    user: {
      id: user.userId,
      username: user.username,
    },
  };
}

export function mapDbChallengeSolved(
  item: DbChallengeSolved,
  user: DbUser
): ChallengeSolved {
  return {
    challengeId: item.challengeId,
    solvedAt: item.data_n,
    user: {
      id: user.userId,
      username: user.username,
    },
  };
}

export function mapDbChallengeSolvedMany(
  items: DbChallengeSolved[],
  users: DbUser[]
): ChallengeSolved[] {
  const userMap = R.indexBy(users, x => x.userId);
  return items.map(item => mapDbChallengeSolved(item, userMap[item.userId]));
}
