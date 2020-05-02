import { createBaseEntity } from '../lib';

export interface TokenKey {
  token: string;
}

export interface TokenProps extends TokenKey {
  userId: string;
}

const BaseEntity = createBaseEntity('Token')
  .props<TokenProps>()
  .key<TokenKey>(key => `TOKEN:${key.token}`)
  .build();

export class TokenEntity extends BaseEntity {}
