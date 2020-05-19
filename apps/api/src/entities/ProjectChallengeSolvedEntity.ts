import { createBaseEntity } from '../lib';

export interface ProjectChallengeSolvedKey {
  userId: string;
  challengeId: number;
  projectId: number;
}

export interface ProjectChallengeSolvedProps extends ProjectChallengeSolvedKey {
  solvedAt: number;
}

const BaseEntity = createBaseEntity('ProjectChallengeSolved')
  .props<ProjectChallengeSolvedProps>()
  .key<ProjectChallengeSolvedKey>(key => ({
    pk: `PROJECT_CHALLENGE_SOLVED:${key.userId}`,
    sk: `PROJECT_CHALLENGE_SOLVED:${key.projectId}:${key.challengeId}:${key.userId}`,
  }))
  .build();

export class ProjectChallengeSolvedEntity extends BaseEntity {}
