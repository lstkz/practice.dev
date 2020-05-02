import { createBaseEntity } from '../lib';

export interface ResetPasswordCodeKey {
  code: string;
}

export interface ResetPasswordCodeProps extends ResetPasswordCodeKey {
  userId: string;
  expireAt: number;
}

const BaseEntity = createBaseEntity('ResetPasswordCode')
  .props<ResetPasswordCodeProps>()
  .key<ResetPasswordCodeKey>(key => `RESET_PASSWORD_CODE:${key.code}`)
  .build();

export class ResetPasswordCodeEntity extends BaseEntity {}
