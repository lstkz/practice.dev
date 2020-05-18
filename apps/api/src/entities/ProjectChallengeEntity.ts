import { createBaseEntity } from '../lib';

export interface ProjectChallengeKey {
  projectId: number;
  challengeId: number;
}

export interface ProjectChallengeProps extends ProjectChallengeKey {
  title: string;
  description: string;
  detailsBundleS3Key: string;
  testsBundleS3Key: string;
  testCase: string;
  createdAt: number;
  assets?: Record<string, string> | null;
}

const BaseEntity = createBaseEntity('ProjectChallenge')
  .props<ProjectChallengeProps>()
  .key<ProjectChallengeKey>(key => ({
    pk: `PROJECT_CHALLENGE:${key.projectId}`,
    sk: `PROJECT_CHALLENGE:${key.challengeId}`,
  }))
  .build();

export class ProjectChallengeEntity extends BaseEntity {
  static getByProject(projectId: number) {
    return this.queryAll({
      key: {
        pk: `PROJECT_CHALLENGE:${projectId}`,
      },
      sort: 'asc',
    });
  }
}
