export interface SearchResult<T> {
  items: T[];
  cursor: null | string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  isVerified: boolean;
}

export interface PublicUser {
  id: string;
  username: string;
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
  title: string;
  slug: string;
  description?: string;
  createdAt: string;
  likes: number;
  tags: string[];
  user: PublicUser;
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
  user: PublicUser;
  status: SubmissionStatus;
  createdAt: string;
  result?: string;
}
export interface TesterMessage {
  id: string;
  challengeId: number;
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
