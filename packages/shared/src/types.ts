export interface User {
  id: string;
  email: string;
  username: string;
  isVerified: boolean;
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
  difficulty: number;
}

export interface ChallengeStats {
  submissions: number;
  solved: number;
}
