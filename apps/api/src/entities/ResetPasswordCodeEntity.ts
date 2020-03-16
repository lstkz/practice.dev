import { PropsOnly } from '../types';
import { BaseEntity } from '../common/orm';

export type ResetPasswordCodeProps = PropsOnly<ResetPasswordCodeEntity>;

export type ResetPasswordCodeKey = {
  code: string;
};

/**
 * Represents a reset password code.
 */
export class ResetPasswordCodeEntity extends BaseEntity {
  userId!: string;
  code!: string;
  expireAt!: number;

  constructor(values: ResetPasswordCodeProps) {
    super(values);
  }

  get key() {
    return ResetPasswordCodeEntity.createKey(this);
  }

  static createKey({ code }: ResetPasswordCodeKey) {
    const pk = `RESET_PASSWORD_CODE:${code.toLowerCase()}`;
    return {
      pk,
      sk: pk,
    };
  }
}
