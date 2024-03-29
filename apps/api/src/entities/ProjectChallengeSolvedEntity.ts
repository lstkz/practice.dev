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

export class ProjectChallengeSolvedEntity extends BaseEntity {
  static async getAllByUserId(userId: string | undefined) {
    if (!userId) {
      return [];
    }
    const items = await this.queryAll({
      key: {
        pk: `PROJECT_CHALLENGE_SOLVED:${userId}`,
      },
      sort: 'asc',
    });
    return items;
  }

  static async getProjectSolvedByUserId(
    projectId: number,
    userId: string | undefined
  ) {
    if (!userId) {
      return [];
    }
    const items = await this.queryAll({
      key: {
        pk: `PROJECT_CHALLENGE_SOLVED:${userId}`,
        sk: ['begins_with', `PROJECT_CHALLENGE_SOLVED:${projectId}:`],
      },
      sort: 'asc',
    });
    return items;
  }

  static async getIsSolved(
    userId: string | undefined,
    { challengeId, projectId }: { projectId: number; challengeId: number }
  ) {
    if (!userId) {
      return false;
    }
    const solved = await this.getByKeyOrNull({
      userId,
      challengeId,
      projectId,
    });
    return solved != null;
  }
}
