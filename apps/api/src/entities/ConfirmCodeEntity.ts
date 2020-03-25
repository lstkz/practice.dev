import { PropsOnly } from '../types';
import { BaseEntity } from '../common/orm';

export type ConfirmCodeProps = PropsOnly<ConfirmCodeEntity>;

export type ConfirmCodeKey = {
  code: string;
};

/**
 * Represents an email confirm code for registration.
 */
export class ConfirmCodeEntity extends BaseEntity {
  userId!: string;
  code!: string;

  constructor(values: ConfirmCodeProps) {
    super(values);
  }

  get key() {
    return ConfirmCodeEntity.createKey(this);
  }

  static createKey({ code }: ConfirmCodeKey) {
    const pk = `CONFIRM_CODE:${code.toLowerCase()}`;
    return {
      pk,
      sk: pk,
    };
  }
}
