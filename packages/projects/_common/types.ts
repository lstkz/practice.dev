export interface ProjectInfo {
  id: number;
  title: string;
  description: string;
  domain: 'frontend' | 'backend' | 'fullstack' | 'styling';
  challenges: ProjectChallengeInfo[];
}

export interface ProjectChallengeInfo {
  id: number;
  title: string;
  description: string;
}
