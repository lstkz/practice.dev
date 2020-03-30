import { createBaseEntityProvider } from '../common/orm-next';

interface SampleEntityKey {
  userId: string;
}

interface SampleEntityProps extends SampleEntityKey {
  name: string;
  age: number;
}

const createBaseEntity = createBaseEntityProvider({
  tableName: 'foo',
  indexes: {
    data: 'string',
    data_n: 'number',
  },
});

const BaseEntity = createBaseEntity()
  .props<SampleEntityProps>()
  .key<SampleEntityKey>(key => ({
    pk: `USER:${key.userId}`,
    sk: `USER:${key.userId}`,
  }))
  .mapping({
    age: 'data_n',
  })
  .build();

export class SampleEntity extends BaseEntity {
  // constructor(props: SampleEntityProps) {
  //   super(props, {
  //     age: 'data_n',
  //   });
  // }
}

const sampleEntity = new SampleEntity({
  userId: '1',
  age: 12,
  name: 'a',
});

sampleEntity.update(['name']);
