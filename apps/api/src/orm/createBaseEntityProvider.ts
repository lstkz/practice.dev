import {
  ColumnMapping,
  CreateKeyHandler,
  BaseEntityClass,
  BaseEntityStatic,
  QueryOptions,
  InstanceMethods,
  DynamoKey,
  QueryAllOptions,
} from './types';
import {
  Converter,
  BatchGetRequestMap,
  BatchWriteItemRequestMap,
} from 'aws-sdk/clients/dynamodb';
import { DatabaseError } from './DatabaseError';
import {
  getPropNames,
  prepareUpdate,
  getKeyExpression,
  getIndexName,
} from './helper';
import { DynamodbWrapper } from './DynamodbWrapper';
import { encLastKey, decLastKey } from '../common/helper';

export interface CreateBaseEntityProviderOptions<TIndexes> {
  dynamodb: AWS.DynamoDB;
  tableName: string;
  indexes: TIndexes;
}

interface CreateBaseEntity<TProps, TKey> {
  mapping(map: ColumnMapping<TProps>): this;
  build(): BaseEntityClass<TProps, TKey>;
}

class Builder {
  private createKey!: CreateKeyHandler<any>;
  private colMapping: ColumnMapping<any> = {};

  constructor(
    public entityType: string,
    private options: CreateBaseEntityProviderOptions<any>
  ) {}

  props() {
    return this;
  }
  key(createKey: CreateKeyHandler<any>) {
    this.createKey = createKey;
    return this;
  }
  mapping(colMapping: ColumnMapping<any>) {
    this.colMapping = colMapping;
    return this;
  }
  build() {
    const { tableName } = this.options;
    const dynamodb = new DynamodbWrapper(this.options.dynamodb);
    const colMapping = this.colMapping;
    const createKey = this.createKey;
    const entityType = this.entityType;
    const getDynamoKey = (key: string | DynamoKey) => {
      const value = createKey(key);
      if (typeof value === 'string') {
        return { pk: value, sk: value };
      }
      return value;
    };

    const getEntityName = (Entity: any): string => {
      return Entity.name;
    };

    function BaseEntity(this: any, props: any) {
      Object.assign(this, { ...props, entityType: entityType });
    }
    BaseEntity.entityType = this.entityType;

    const instance: InstanceMethods<any> = {
      async insert(options) {
        await dynamodb.putItem({
          TableName: this.getTableName(),
          Item: Converter.marshall(this.serialize()),
          ConditionExpression: options?.conditionExpression,
          ExpressionAttributeNames: options?.expressionNames ?? undefined,
          ExpressionAttributeValues: options?.expressionValues
            ? Converter.marshall(options?.expressionValues)
            : undefined,
        });
      },
      async delete(options) {
        await dynamodb.deleteItem({
          TableName: this.getTableName(),
          Key: Converter.marshall(this.getKey()),
          ConditionExpression: options?.conditionExpression,
          ExpressionAttributeNames: options?.expressionNames ?? undefined,
          ExpressionAttributeValues: options?.expressionValues
            ? Converter.marshall(options?.expressionValues)
            : undefined,
        });
      },
      async update(fields: any[], options) {
        const {
          updateExpression,
          expressionValues,
          expressionNames,
        } = prepareUpdate(this, fields);
        await dynamodb.updateItem({
          TableName: tableName,
          Key: Converter.marshall(this.getKey()),
          UpdateExpression: updateExpression,
          ConditionExpression: options?.conditionExpression,
          ExpressionAttributeNames: {
            ...expressionNames,
            ...(options?.expressionNames ?? {}),
          },
          ExpressionAttributeValues: Converter.marshall({
            ...expressionValues,
            ...(options?.expressionValues ?? {}),
          }),
        });
      },
      getTableName() {
        return tableName;
      },
      getKey() {
        return getDynamoKey(this as any);
      },
      serialize() {
        const values: any = {
          ...this.getKey(),
        };
        const names = getPropNames(this);
        names.forEach(name => {
          const mapped = colMapping[name] || name;
          values[mapped] = (this as any)[name];
        });
        return values;
      },
      getProps() {
        const values: any = {};
        const names = getPropNames(this);
        names.forEach(name => {
          values[name] = (this as any)[name];
        });
        return values;
      },
    };

    const statics: BaseEntityStatic<any, any> = {
      fromDynamo(rawValues: Record<string, any>) {
        const values = Converter.unmarshall(rawValues);
        return this.fromJSON(values);
      },
      fromJSON(values: Record<string, any>) {
        const reverseMap: any = {};
        const props: any = {};
        Object.keys(colMapping).forEach(key => {
          const mappedKey = colMapping[key];
          if (mappedKey) {
            reverseMap[mappedKey] = key;
          }
        });
        Object.keys(values)
          .filter(key => !['pk', 'sk'].includes(key))
          .forEach(key => {
            const classKey = reverseMap[key] || key;
            props[classKey] = values[key];
          });
        const Ctor = this as any;

        return new Ctor(props);
      },
      createKey(key) {
        return getDynamoKey(key);
      },
      async getByKey(key) {
        const item = await this.getByKeyOrNull(key);
        if (!item) {
          const dynamoKey = getDynamoKey(key);
          throw new DatabaseError(
            `${getEntityName(this)} not found with pk="${
              dynamoKey.pk
            }" and sk="${dynamoKey.pk}"`
          );
        }
        return item;
      },
      async getByKeyOrNull(key) {
        const { Item: item } = await dynamodb.getItem({
          Key: Converter.marshall(getDynamoKey(key)),
          TableName: tableName,
        });
        if (!item) {
          return null;
        }
        return this.fromDynamo(item);
      },
      async query(options: QueryOptions) {
        const {
          keyExpression,
          keyExpressionNames,
          keyExpressionValues,
        } = getKeyExpression(options.key);
        const expressionValues: any = {
          ...keyExpressionValues,
          ...(options.expressionValues || {}),
        };
        const expressionNames: any = {
          ...keyExpressionNames,
          ...(options.expressionNames || {}),
        };
        const result = await dynamodb.query({
          TableName: tableName,
          IndexName: getIndexName(options.key),
          ScanIndexForward: (options.sort ?? 'asc') === 'asc',
          KeyConditionExpression: keyExpression,
          FilterExpression: options.filterExpression,
          ExpressionAttributeNames: expressionNames,
          ExpressionAttributeValues: Converter.marshall(expressionValues),
          Limit: options.limit,
          ExclusiveStartKey: options.lastKey
            ? Converter.marshall(decLastKey(options.lastKey))
            : undefined,
        });
        return {
          items: (result.Items ?? []).map(item =>
            this.fromDynamo(item)
          ) as Array<InstanceType<any>>,
          lastKey: result.LastEvaluatedKey
            ? encLastKey(Converter.unmarshall(result.LastEvaluatedKey))
            : null,
        };
      },
      async queryAll(options: QueryAllOptions) {
        const allItems: Array<InstanceType<any>> = [];
        const fetch = async (lastKey?: any) => {
          const result = await this.query({
            ...options,
            lastKey,
          });
          allItems.push(...result.items);
          if (result.lastKey) {
            await fetch(result.lastKey);
          }
        };
        await fetch();
        return allItems;
      },
      async batchGet(keys, retry = 20) {
        if (!keys.length) {
          return [];
        }
        const allItems: Array<InstanceType<any>> = [];
        const fetch = async (requestItems: BatchGetRequestMap) => {
          if (!retry) {
            console.error('requestItems', requestItems);
            throw new Error('Cannot process batchGetItemWithRetry. Retry = 0.');
          }
          retry--;
          const result = await dynamodb.batchGetItem({
            RequestItems: requestItems,
          });

          const ret = result.Responses || {};

          allItems.push(
            ...(ret[tableName] ?? []).map(item => this.fromDynamo(item))
          );
          if (
            result.UnprocessedKeys &&
            Object.keys(result.UnprocessedKeys).length
          ) {
            await fetch(result.UnprocessedKeys);
          }
        };
        await fetch({
          [tableName]: {
            Keys: keys.map(key => Converter.marshall(this.createKey(key))),
          },
        });
        return allItems;
      },
      async batchDelete(entities, retry = 20) {
        if (!entities.length) {
          return;
        }
        const fetch = async (requestItems: BatchWriteItemRequestMap) => {
          if (!retry) {
            console.error('requestItems', requestItems);
            throw new Error('Cannot process batchDelete. Retry = 0.');
          }
          retry--;
          const result = await dynamodb.batchWriteItem({
            RequestItems: requestItems,
          });

          if (
            result.UnprocessedItems &&
            Object.keys(result.UnprocessedItems).length
          ) {
            await fetch(result.UnprocessedItems);
          }
        };
        await fetch({
          [tableName]: entities.map(item => ({
            DeleteRequest: { Key: Converter.marshall(item.getKey()) },
          })),
        });
      },
    };
    Object.assign(BaseEntity, statics);
    Object.assign(BaseEntity.prototype, instance);
    return BaseEntity;
  }
}
export type CreateBaseEntityBuilder = (
  entityType: string
) => {
  props<TProps>(): {
    key<TKey>(fn: CreateKeyHandler<TKey>): CreateBaseEntity<TProps, TKey>;
  };
};

export function createBaseEntityProvider<
  TIndexes extends Record<string, 'string' | 'number'>
>(options: CreateBaseEntityProviderOptions<TIndexes>): CreateBaseEntityBuilder {
  return (entityType: string) => new Builder(entityType, options) as any;
}
