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
