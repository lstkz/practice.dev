export interface ExpressionOptions {
  conditionExpression: string;
  expressionNames?: Record<string, string>;
  expressionValues?: Record<string, any>;
}

export type DbIndex = 'sk-data_n-index' | 'sk-data2_n-index' | 'sk-data-index';

export interface InstanceMethods<T> {
  delete(options?: ExpressionOptions): Promise<void>;
  insert(options?: ExpressionOptions): Promise<void>;
  update(fields: Array<keyof T>, options?: ExpressionOptions): Promise<void>;
  getTableName(): string;
  getKey(): DynamoKey;
  serialize(): object;
  getProps(): T;
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
  fromJSON<T extends BaseEntityClass<TProps, TKey>>(
    this: T,
    values: Record<string, any>
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
  ): Promise<SearchResult<InstanceType<T>>>;
  queryAll<T extends BaseEntityClass<TProps, TKey>>(
    this: T,
    options: QueryAllOptions
  ): Promise<Array<InstanceType<T>>>;
  createKey(key: TKey): DynamoKey;
  batchGet<T extends BaseEntityClass<TProps, TKey>>(
    this: T,
    keys: TKey[],
    retry?: number
  ): Promise<Array<InstanceType<T>>>;
  batchDelete<T extends BaseEntityClass<TProps, TKey>>(
    this: T,
    entities: Array<InstanceType<T>>,
    retry?: number
  ): Promise<void>;
}

export interface BaseEntityClass<TProps, TKey>
  extends BaseEntityStatic<TProps, TKey> {
  new (props: TProps): Instance<TProps>;
  entityType: string;
}

export interface SearchResult<T> {
  items: T[];
  lastKey: string | null;
}

export interface QueryOptions extends QueryAllOptions {
  limit?: number;
  lastKey?: string | null;
}

export type QueryOperator = '=' | '!=' | 'begins_with';

export type QueryKey =
  | {
      pk: string;
      sk?: [QueryOperator, string];
    }
  | {
      sk: string;
      data: [QueryOperator, string] | null;
    }
  | {
      sk: string;
      data_n: [QueryOperator, number] | null;
    }
  | {
      sk: string;
      data2_n: [QueryOperator, number] | null;
    };

export interface QueryAllOptions {
  key: QueryKey;
  sort?: 'asc' | 'desc';
  filterExpression?: string;
  expressionValues?: Record<string, any>;
  expressionNames?: Record<string, string>;
}

export interface BaseSearchCriteria {
  limit?: number;
  lastKey?: string | null;
  sort: 'asc' | 'desc';
}
