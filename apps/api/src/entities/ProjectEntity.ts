import { createBaseEntity } from '../lib';
import { ProjectStats, ProjectDomain } from 'shared';

export interface ProjectKey {
  projectId: number;
}

export interface ProjectProps extends ProjectKey {
  title: string;
  description: string;
  createdAt: number;
  stats: ProjectStats;
  domain: ProjectDomain;
}

const BaseEntity = createBaseEntity('Project')
  .props<ProjectProps>()
  .key<ProjectKey>(key => `PROJECT:${key.projectId}`)
  .build();

export class ProjectEntity extends BaseEntity {}
