import { createBaseEntity } from '../lib';

export interface ChangeEmailRequestKey {
  code: string;
}

export interface ChangeEmailRequestProps extends ChangeEmailRequestKey {
  email: string;
  userId: string;
  expireAt: number;
}

const BaseEntity = createBaseEntity('ChangeEmailRequest')
  .props<ChangeEmailRequestProps>()
  .key<ChangeEmailRequestKey>(key => `CHANGE_EMAIL_REQUEST:${key.code}`)
  .build();

export class ChangeEmailRequestEntity extends BaseEntity {}
