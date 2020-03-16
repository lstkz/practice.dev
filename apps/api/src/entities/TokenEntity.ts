import { PropsOnly } from '../types';
import { BaseEntity } from '../common/orm';

export type TokenProps = PropsOnly<TokenEntity>;

export type TokenKey = {
  token: string;
};

/**
 * Represents an authentication token.
 */
export class TokenEntity extends BaseEntity {
  userId!: string;
  token!: string;

  constructor(values: TokenProps) {
    super(values);
  }

  get key() {
    return TokenEntity.createKey(this);
  }

  static createKey({ token }: TokenKey) {
    const pk = `TOKEN:${token.toLowerCase()}`;
    return {
      pk,
      sk: pk,
    };
  }
}
