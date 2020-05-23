import { createBaseEntity } from '../lib';
import { ProjectStats, Project, ChallengeDomain } from 'shared';

export interface ProjectKey {
  projectId: number;
}

export interface ProjectProps extends ProjectKey {
  title: string;
  description: string;
  createdAt: number;
  stats: ProjectStats;
  domain: ChallengeDomain;
  challengeCount: number;
}

const BaseEntity = createBaseEntity('Project')
  .props<ProjectProps>()
  .key<ProjectKey>(key => ({
    pk: `PROJECT:${key.projectId}`,
    sk: 'PROJECT',
  }))
  .mapping({
    projectId: 'data_n',
  })
  .build();

export class ProjectEntity extends BaseEntity {
  toProject(solvedPercent: number): Project {
    return {
      id: this.projectId,
      title: this.title,
      description: this.description,
      createdAt: new Date(this.createdAt).toISOString(),
      stats: this.stats,
      domain: this.domain,
      solvedPercent,
    };
  }

  static getAll() {
    return this.queryAll({
      key: {
        sk: 'PROJECT',
        data_n: null,
      },
      sort: 'asc',
    });
  }
}
