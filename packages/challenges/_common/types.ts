export type ChallengeTag = 'frontend' | 'easy' | 'medium' | 'hard';

export interface ChallengeInfo {
  id: 1;
  title: string;
  description: string;
  tags: ChallengeTag[];
}
