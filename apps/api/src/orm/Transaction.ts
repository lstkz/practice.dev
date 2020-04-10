import { DynamoDB } from 'aws-sdk';
import { ExpressionOptions, Instance, DynamoKey } from './types';
import { TransactWriteItemList, Converter } from 'aws-sdk/clients/dynamodb';
import { prepareUpdate } from './helper';

interface UpdateRawOptions {
  tableName: string;
  key: DynamoKey;
  updateExpression: string;
  expressionValues: Record<string, any>;
  expressionNames?: Record<string, string>;
}

interface CommitOptions {
  ignoreTransactionCanceled?: boolean;
}

export class Transaction {
  private insertEntities: Array<[Instance<{}>, ExpressionOptions?]> = [];
  private updateEntities: Array<
    [Instance<{}>, string[], ExpressionOptions?]
  > = [];
  private deleteEntities: Array<[Instance<{}>, ExpressionOptions?]> = [];
  private updateRawEntities: UpdateRawOptions[] = [];

  constructor(private dynamodb: DynamoDB) {}

  insert<T>(entity: Instance<T>, options?: ExpressionOptions) {
    this.insertEntities.push([entity, options]);
  }

  update<T>(
    entity: Instance<T>,
    fields: Array<keyof T>,
    options?: ExpressionOptions
  ) {
    this.updateEntities.push([entity, fields, options]);
  }

  updateRaw(options: UpdateRawOptions) {
    this.updateRawEntities.push(options);
  }

  delete<T>(entity: Instance<T>, options?: ExpressionOptions) {
    this.deleteEntities.push([entity, options]);
  }

  async commit(options?: CommitOptions) {
    const items: TransactWriteItemList = [];
    this.insertEntities.forEach(([instance, options]) => {
      items.push({
        Put: {
          TableName: instance.getTableName(),
          Item: Converter.marshall(instance.serialize()),
          ConditionExpression: options?.conditionExpression,
          ExpressionAttributeNames: options?.expressionNames,
          ExpressionAttributeValues: options?.expressionValues
            ? Converter.marshall(options.expressionValues)
            : undefined,
        },
      });
    });
    this.updateEntities.forEach(([instance, keys, options]) => {
      const {
        updateExpression,
        expressionValues,
        expressionNames,
      } = prepareUpdate(instance, keys);
      items.push({
        Update: {
          TableName: instance.getTableName(),
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
        },
      });
    });
    this.deleteEntities.forEach(([instance, options]) => {
      items.push({
        Delete: {
          TableName: instance.getTableName(),
          Key: Converter.marshall(instance.getKey()),
          ConditionExpression: options?.conditionExpression,
          ExpressionAttributeNames: options?.expressionNames,
          ExpressionAttributeValues: options?.expressionValues
            ? Converter.marshall(options.expressionValues)
            : undefined,
        },
      });
    });
    this.updateRawEntities.forEach(options => {
      items.push({
        Update: {
          TableName: options.tableName,
          Key: Converter.marshall(options.key),
          UpdateExpression: options.updateExpression,
          ExpressionAttributeValues: Converter.marshall(
            options.expressionValues
          ),
          ExpressionAttributeNames: options.expressionNames,
        },
      });
    });
    try {
      if (process.env.MOCK_DB && items.length > 10) {
        await Promise.all([
          this.dynamodb
            .transactWriteItems({
              TransactItems: items.slice(0, 10),
            })
            .promise(),
          this.dynamodb
            .transactWriteItems({
              TransactItems: items.slice(10),
            })
            .promise(),
        ]);
      } else {
        await this.dynamodb
          .transactWriteItems({
            TransactItems: items,
          })
          .promise();
      }
    } catch (e) {
      if (options?.ignoreTransactionCanceled) {
        if (e.code === 'TransactionCanceledException') {
          return;
        }
      }
      throw e;
    }
  }
}
