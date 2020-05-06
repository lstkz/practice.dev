import { createBaseEntity } from '../lib';

export interface SequenceKey {
  name: string;
}

export interface SequenceProps extends SequenceKey {
  value: number;
}

const BaseEntity = createBaseEntity('Sequence')
  .props<SequenceProps>()
  .key<SequenceKey>(key => `SEQUENCE:${key.name}`)
  .build();

export class SequenceEntity extends BaseEntity {}
