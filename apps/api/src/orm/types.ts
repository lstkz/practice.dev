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

export interface BaseEntityStatic<TProps, TKey> {
  fromDynamo<T extends BaseEntityClass<TProps, TKey>>(
    this: T,
    rawValues: Record<string, any>
  ): InstanceType<T>;
  getByKey<T extends BaseEntityClass<TProps, TKey>>(
    this: T,
    key: TKey
  ): Promise<InstanceType<T>>;
  getByKeyOrNull<T extends BaseEntityClass<TProps, TKey>>(
    this: T,
    key: TKey
  ): Promise<InstanceType<T> | null>;
  query<T extends BaseEntityClass<TProps, TKey>>(
    this: T,
    options: QueryOptions
  ): SearchResult<InstanceType<T>>;
}

export interface BaseEntityClass<TProps, TKey>
  extends BaseEntityStatic<TProps, TKey> {
  new (props: TProps, mapping?: ColumnMapping<TProps>): Instance<TProps>;
}

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
