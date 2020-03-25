import { PropsOnly } from '../types';
import { BaseEntity } from '../common/orm';

export type SequenceProps = PropsOnly<SequenceEntity>;

export type SequenceKey = {
  name: string;
};

/**
 * Represents an entity for generating uniq sequences.
 */
export class SequenceEntity extends BaseEntity {
  name!: string;
  value!: number;

  constructor(values: SequenceProps) {
    super(values);
  }

  get key() {
    return SequenceEntity.createKey(this);
  }

  static createKey({ name }: SequenceKey) {
    const pk = `SEQUENCE:${name}`;
    return {
      pk,
      sk: pk,
    };
  }
}
