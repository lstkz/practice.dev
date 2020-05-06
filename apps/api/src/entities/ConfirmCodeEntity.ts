import { createBaseEntity } from '../lib';

export interface ConfirmCodeKey {
  code: string;
}

export interface ConfirmCodeProps extends ConfirmCodeKey {
  userId: string;
}

const BaseEntity = createBaseEntity('ConfirmCodeE')
  .props<ConfirmCodeProps>()
  .key<ConfirmCodeKey>(key => `CONFIRM_CODE:${key.code}`)
  .build();

export class ConfirmCodeEntity extends BaseEntity {}
