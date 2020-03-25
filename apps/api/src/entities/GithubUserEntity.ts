import { PropsOnly } from '../types';
import { BaseEntity } from '../common/orm';

export type GithubUserProps = PropsOnly<GithubUserEntity>;

export type GithubUserKey = {
  githubId: number;
};

/**
 * Represents a mapping between user and github id.
 */
export class GithubUserEntity extends BaseEntity {
  userId!: string;
  githubId!: number;

  constructor(values: GithubUserProps) {
    super(values);
  }

  get key() {
    return GithubUserEntity.createKey(this);
  }

  static createKey({ githubId }: GithubUserKey) {
    const pk = `GITHUB_USER:${githubId}`;
    return {
      pk,
      sk: pk,
    };
  }
}
