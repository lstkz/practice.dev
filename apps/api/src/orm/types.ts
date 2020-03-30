export interface ExpressionOptions {
  conditionExpression: string;
  expressionNames?: Record<string, string>;
  expressionValues?: Record<string, any>;
}

export interface InstanceMethods<T> {
  insert(): Promise<void>;
  update(fields: Array<keyof T>, options?: ExpressionOptions): Promise<void>;
  getTableName(): string;
  getKey(): DynamoKey;
  serialize(): object;
}

export type Instance<T> = T & InstanceMethods<T>;

export interface DynamoKey {
  pk: string;
  sk: string;
}

export type CreateKeyHandler<TKey> = (key: TKey) => DynamoKey | string;

export type ColumnMapping<TProps> = {
  [x in keyof TProps]?: string;
};

export type BaseEntityStatic<TProps, TKey> = {
  fromDynamo(rawValues: Record<string, any>): Instance<TProps>;
  getByKey(key: TKey): TProps;
  getByKeyOrNull(key: TKey): TProps | null;
  query(options: QueryOptions): SearchResult<Instance<TProps>>;
};

export type BaseEntityClass<TProps, TKey> = {
  new (props: TProps, mapping?: ColumnMapping<TProps>): Instance<TProps>;
} & BaseEntityStatic<TProps, TKey>;

export interface SearchResult<T> {
  items: T[];
  lastKey: string;
}

export interface QueryOptions {
  pk: string;
  sk: ['=', string];
  sort: 'asc' | 'desc';
  lastKey: DynamoKey;
}
