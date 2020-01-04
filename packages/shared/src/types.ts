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
  bundle: string;
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
}
export interface TesterMessage {
  id: string;
  challengeId: number;
  testUrl: string;
  tests: string;
  userId: string;
}

export type StepResult =
  | 'pass'
  | 'fail'
  | 'pending'
  | 'running'
  | 'fail-skipped';

export interface Step {
  id: number;
  name: string;
  result: StepResult;
  error?: string;
}

export type TestResult =
  | 'pass'
  | 'fail'
  | 'pending'
  | 'running'
  | 'fail-skipped';

export interface TestInfo {
  id: number;
  name: string;
  result: TestResult;
  steps: Step[];
}

export type SocketMessage =
  | {
      type: 'TEST_INFO';
      payload: {
        tests: TestInfo[];
      };
    }
  | {
      type: 'STARTING_TEST';
      payload: {
        testId: number;
      };
    }
  | {
      type: 'TEST_FAIL';
      payload: {
        testId: number;
      };
    }
  | {
      type: 'TEST_PASS';
      payload: {
        testId: number;
      };
    }
  | {
      type: 'STARTING_STEP';
      payload: {
        testId: number;
        stepId: number;
      };
    }
  | {
      type: 'STEP_PASS';
      payload: {
        testId: number;
        stepId: number;
      };
    }
  | {
      type: 'STEP_FAIL';
      payload: {
        testId: number;
        stepId: number;
        error: string;
      };
    }
  | {
      type: 'RESULT';
      payload: {
        success: boolean;
      };
    };
