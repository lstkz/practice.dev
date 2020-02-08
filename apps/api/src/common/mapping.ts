import * as R from 'remeda';
import {
  DbUser,
  DbChallenge,
  DbSolution,
  DbChallengeSolved,
  DbSubmission,
  DbSolutionVote,
} from '../types';
import {
  User,
  Challenge,
  Solution,
  ChallengeSolved,
  Submission,
  PublicUser,
} from 'shared';

export function mapDbUser(item: DbUser): User {
  return {
    id: item.userId,
    email: item.email,
    username: item.username,
    isVerified: item.isVerified,
  };
}

function mapToPublicUser(item: DbUser): PublicUser {
  return {
    id: item.userId,
    username: item.username,
  };
}

export function mapDbChallenge(item: DbChallenge, isSolved = false): Challenge {
  return {
    id: item.data_n,
    title: item.title,
    description: item.description,
    detailsBundleS3Key: item.detailsBundleS3Key,
    testCase: item.testCase,
    tags: item.tags,
    isSolved,
    createdAt: new Date(item.createdAt).toISOString(),
    stats: item.stats,
    difficulty: item.difficulty,
    domain: item.domain,
  };
}

export function mapDbSolution(
  item: DbSolution,
  user: DbUser,
  vote?: DbSolutionVote | null | undefined
): Solution {
  return {
    id: item.solutionId,
    challengeId: item.challengeId,
    title: item.title,
    description: item.description,
    slug: item.slug,
    url: item.url,
    createdAt: new Date(item.data_n).toISOString(),
    likes: item.data2_n,
    tags: item.tags,
    user: mapToPublicUser(user),
    isLiked: !!vote,
  };
}

export function mapDbSolutionSolvedMany(
  items: DbSolution[],
  users: DbUser[],
  votes: DbSolutionVote[]
): Solution[] {
  const userMap = R.indexBy(users, x => x.userId);
  const voteMap = R.indexBy(votes, x => x.solutionId);
  return items.map(item =>
    mapDbSolution(item, userMap[item.userId], voteMap[item.solutionId])
  );
}

export function mapDbChallengeSolved(
  item: DbChallengeSolved,
  user: DbUser
): ChallengeSolved {
  return {
    challengeId: item.challengeId,
    solvedAt: item.data_n,
    user: mapToPublicUser(user),
  };
}

export function mapDbChallengeSolvedMany(
  items: DbChallengeSolved[],
  users: DbUser[]
): ChallengeSolved[] {
  const userMap = R.indexBy(users, x => x.userId);
  return items.map(item => mapDbChallengeSolved(item, userMap[item.userId]));
}

export function mapDbSubmission(item: DbSubmission, user: DbUser): Submission {
  return {
    id: item.submissionId,
    challengeId: item.challengeId,
    user: mapToPublicUser(user),
    status: item.status,
    createdAt: new Date(item.data_n).toISOString(),
  };
}

export function mapDbSubmissionMany(
  items: DbSubmission[],
  users: DbUser[]
): Submission[] {
  const userMap = R.indexBy(users, x => x.userId);
  return items.map(item => mapDbSubmission(item, userMap[item.userId]));
}
