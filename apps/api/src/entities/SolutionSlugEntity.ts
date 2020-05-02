import { createBaseEntity } from '../lib';

export interface SolutionSlugKey {
  slug: string;
  challengeId: number;
}

export interface SolutionSlugProps extends SolutionSlugKey {
  solutionId: string;
}

const BaseEntity = createBaseEntity('SolutionSlug')
  .props<SolutionSlugProps>()
  .key<SolutionSlugKey>(key => `SOLUTION_SLUG:${key.challengeId}:${key.slug}`)
  .build();

export class SolutionSlugEntity extends BaseEntity {}
