import { createBaseEntity } from '../lib';

export interface GithubUserKey {
  githubId: number;
}

export interface GithubUserProps extends GithubUserKey {
  userId: string;
}

const BaseEntity = createBaseEntity('GithubUser')
  .props<GithubUserProps>()
  .key<GithubUserKey>(key => `GITHUB_USER:${key.githubId}`)
  .build();

export class GithubUserEntity extends BaseEntity {}
