import { createBaseEntity } from '../lib';

export interface {{name}}Key {
  foo: string;
}

export interface {{name}}Props extends {{name}}Key {
  bar: string;
}

const BaseEntity = createBaseEntity()
  .props<{{name}}Props>()
  .key<{{name}}Key>(key => `FOO:${key.foo}`)
  .key<{{name}}Key>(key => ({
    pk: `FOO:${key.foo}`,
    sk: `BAR:${key.bar}`,
  }))
  .build();

export class {{name}}Entity extends BaseEntity {}
