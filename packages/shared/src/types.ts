export interface LoadMoreResult<T> {
  items: T[];
  cursor: null | string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  isVerified: boolean;
  isAdmin?: boolean;
  avatarUrl?: string | null;
}

export interface PublicUser {
  id: string;
  username: string;
  avatarUrl?: string | null;
}

export interface AuthData {
  user: User;
  token: string;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  detailsBundleS3Key: string;
  testCase: string;
  tags: string[];
  isSolved: boolean;
  createdAt: string;
  stats: ChallengeStats;
  difficulty: ChallengeDifficulty;
  domain: ChallengeDomain;
  assets?: Record<string, string> | null;
}

export interface ChallengeStats {
  submissions: number;
  solved: number;
  solutions: number;
  likes: number;
}

export type ChallengeDomain = 'frontend' | 'backend' | 'fullstack' | 'styling';
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';

export interface Solution {
  id: string;
  challengeId: number;
  title: string;
  slug: string;
  url: string;
  description?: string;
  createdAt: string;
  likes: number;
  tags: string[];
  user: PublicUser;
  isLiked: boolean;
}

export interface ChallengeSolved {
  user: PublicUser;
  challengeId: number;
  solvedAt: number;
}
export enum SubmissionStatus {
  Queued = 'QUEUED',
  Running = 'RUNNING',
  Pass = 'PASS',
  Fail = 'FAIL',
}

export interface Submission {
  id: string;
  challengeId: number;
  projectId?: number;
  user: PublicUser;
  status: SubmissionStatus;
  createdAt: string;
  type: SubmissionType;
}

export type SubmissionType = 'challenge' | 'project';

export interface SolutionTag {
  name: string;
  count: number;
}

export interface ChallengeTag {
  name: string;
  count: number;
}

export interface TesterMessage {
  id: string;
  testUrl: string;
  tests: string;
  userId: string;
  type: 'frontend' | 'backend';
}

export type TestResult =
  | 'pass'
  | 'fail'
  | 'pending'
  | 'running'
  | 'fail-skipped';

export interface Step {
  text: string;
  data?: any;
}

export interface TestInfo {
  id: number;
  name: string;
  error?: string;
  steps: Step[];
  result: TestResult;
}

export type SocketMessage =
  | {
      type: 'TEST_INFO';
      meta: {
        id: string;
      };
      payload: {
        tests: TestInfo[];
      };
    }
  | {
      type: 'STARTING_TEST';
      meta: {
        id: string;
      };
      payload: {
        testId: number;
      };
    }
  | {
      type: 'TEST_FAIL';
      meta: {
        id: string;
      };
      payload: {
        testId: number;
        error: string;
      };
    }
  | {
      type: 'TEST_PASS';
      meta: {
        id: string;
      };
      payload: {
        testId: number;
      };
    }
  | {
      type: 'STEP';
      meta: {
        id: string;
      };
      payload: {
        testId: number;
        text: string;
        data: any;
      };
    }
  | {
      type: 'RESULT';
      meta: {
        id: string;
      };
      payload: {
        success: boolean;
      };
    };

export interface PagedResult<T> {
  items: T[];
  total: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
}

export interface PublicUserProfile {
  id: string;
  username: string;
  country: string | null;
  avatarUrl: string | null;
  name: string;
  url: string;
  bio: string;
  isFollowed: boolean;
  submissionsCount: number;
  solutionsCount: number;
  likesCount: number;
  followersCount: number;
  followingCount: number;
}

export interface PresignedPost {
  url: string;
  fields: Record<string, string>;
}

export interface DiscussionComment {
  id: string;
  parentCommentId?: string | null;
  user: PublicUser;
  challengeId: number;
  text: string;
  isAnswered: boolean;
  isAnswer: boolean;
  isDeleted: boolean;
  children: DiscussionComment[];
  createdAt: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  solvedPercent: number;
  createdAt: string;
  stats: ProjectStats;
  domain: ChallengeDomain;
}

export interface ProjectInfo {
  id: number;
  title: string;
}

export type ProjectStats = Record<string, number>;

export interface ProjectChallenge {
  id: number;
  title: string;
  description: string;
  detailsBundleS3Key: string;
  testCase: string;
  isSolved: boolean;
  createdAt: string;
  assets?: Record<string, string> | null;
  stats: ProjectChallengeStats;
  isLocked: boolean;
  project: ProjectInfo;
  domain: ChallengeDomain;
}

export interface ProjectChallengeStats {
  submissions: number;
  solved: number;
}
