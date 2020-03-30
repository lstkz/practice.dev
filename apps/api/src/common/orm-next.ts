interface ExpressionOptions {
  conditionExpression: string;
  expressionNames?: Record<string, string>;
  expressionValues?: Record<string, any>;
}

type Instance<T> = T & {
  insert(): Promise<void>;
  update(fields: Array<keyof T>, options?: ExpressionOptions): Promise<void>;
  getTableName(): string;
};

export interface QueryOptions {
  pk: string;
  sk: ['=', string];
  sort: 'asc' | 'desc';
  lastKey: DynamoKey;
}

export interface SearchResult<T> {
  items: T[];
  lastKey: string;
}

export type BaseEntity2<TProps, TKey> = {
  new (
    props: TProps,
    mapping?: {
      [x in keyof TProps]?: string;
    }
  ): Instance<TProps>;

  fromDynamo(rawValues: Record<string, any>): Instance<TProps>;
  getByKey(key: TKey): TProps;
  getByKeyOrNull(key: TKey): TProps | null;
  query(options: QueryOptions): SearchResult<Instance<TProps>>;
};

interface CreateBaseEntity<TProps, TKey> {
  // props<TNewProps>(): CreateBaseEntity<TNewProps, TKey>;
  // key<TNewKey>(): CreateBaseEntity<TProps, TNewKey>;
  mapping(map: ColumnMapping<TProps>): this;
  build(): { new (): TProps & BaseEntity<TProps, TKey> };
}

export class BaseEntity<TProps, TKey> {
  constructor(props: TProps, mapping: any) {}
}
