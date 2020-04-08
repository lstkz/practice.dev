import {
  ColumnMapping,
  CreateKeyHandler,
  BaseEntityClass,
  BaseEntityStatic,
  QueryOptions,
  Instance,
  InstanceMethods,
  DynamoKey,
} from './types';
import { Converter } from 'aws-sdk/clients/dynamodb';
import { DatabaseError } from './DatabaseError';
import { getPropNames, prepareUpdate } from './helper';

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

  constructor(private options: CreateBaseEntityProviderOptions<any>) {}

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
    const { dynamodb, tableName } = this.options;
    const colMapping = this.colMapping;
    const createKey = this.createKey;
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
      Object.assign(this, props);
    }

    const instance: InstanceMethods<any> = {
      async insert() {
        await dynamodb
          .putItem({
            TableName: this.getTableName(),
            Item: Converter.marshall(this.serialize()),
          })
          .promise();
      },
      async update(fields: any[], options) {
        const {
          updateExpression,
          expressionValues,
          expressionNames,
        } = prepareUpdate(instance, fields);
        await dynamodb
          .updateItem({
            TableName: tableName,
            Key: Converter.marshall(instance.getKey()),
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
          })
          .promise();
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
    };

    const statics: BaseEntityStatic<any, any> = {
      fromDynamo(rawValues: Record<string, any>) {
        const values = Converter.unmarshall(rawValues);
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
        const { Item: item } = await dynamodb
          .getItem({
            Key: Converter.marshall(getDynamoKey(key)),
            TableName: tableName,
          })
          .promise();
        if (!item) {
          return null;
        }
        return this.fromDynamo(item);
      },
      query(options: QueryOptions) {
        throw new Error('todo');
      },
    };
    Object.assign(BaseEntity, statics);
    Object.assign(BaseEntity.prototype, instance);
    return BaseEntity;
  }
}
export type CreateBaseEntityBuilder = () => {
  props<TProps>(): {
    key<TKey>(fn: CreateKeyHandler<TKey>): CreateBaseEntity<TProps, TKey>;
  };
};

export function createBaseEntityProvider<
  TIndexes extends Record<string, 'string' | 'number'>
>(options: CreateBaseEntityProviderOptions<TIndexes>): CreateBaseEntityBuilder {
  return () => new Builder(options) as any;
}
