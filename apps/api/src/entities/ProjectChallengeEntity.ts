import { createBaseEntity } from '../lib';
import { ProjectChallenge } from 'shared';
import { ProjectEntity } from './ProjectEntity';

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
  toChallenge(
    project: ProjectEntity,
    props: { isSolved: boolean; isLocked: boolean }
  ): ProjectChallenge {
    const base = {
      ...props,
      id: this.challengeId,
      project: {
        id: project.projectId,
        title: project.title,
      },
      createdAt: new Date(this.createdAt).toISOString(),
      stats: {
        solved: project.stats['solved_' + this.challengeId] ?? 0,
        submissions: project.stats['submissions_' + this.challengeId] ?? 0,
      },
    };
    if (props.isLocked) {
      return {
        ...base,
        title: '',
        description: '',
        detailsBundleS3Key: '',
        testCase: '',
        assets: {},
      };
    } else {
      return {
        ...base,
        title: this.title,
        description: this.description,
        detailsBundleS3Key: this.detailsBundleS3Key,
        testCase: this.testCase,
        assets: this.assets,
      };
    }
  }

  static getByProject(projectId: number) {
    return this.queryAll({
      key: {
        pk: `PROJECT_CHALLENGE:${projectId}`,
      },
      sort: 'asc',
    });
  }
}