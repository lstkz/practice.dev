import { DynamoDB } from 'aws-sdk';

class DynamodbError extends Error {
  public code: string;
  constructor(
    stack: string | undefined,
    message: string,
    public originalError: Error,
    public params: any
  ) {
    super(message + ': ' + originalError.message);
    this.stack = stack;
    this.code = (originalError as any).code;
  }
}

function wrapError(message: string, params: any) {
  const err = new Error();
  return (e: Error) => {
    throw new DynamodbError(err.stack, message, e, params);
  };
}

export class DynamodbWrapper {
  constructor(private dynamodb: DynamoDB) {}

  putItem(params: DynamoDB.PutItemInput) {
    return this.dynamodb
      .putItem(params)
      .promise()
      .catch(wrapError('Failed to putItem', params));
  }
  deleteItem(params: DynamoDB.DeleteItemInput) {
    return this.dynamodb
      .deleteItem(params)
      .promise()
      .catch(wrapError('Failed to deleteItem', params));
  }
  updateItem(params: DynamoDB.UpdateItemInput) {
    return this.dynamodb
      .updateItem(params)
      .promise()
      .catch(wrapError('Failed to updateItem', params));
  }
  getItem(params: DynamoDB.GetItemInput) {
    return this.dynamodb
      .getItem(params)
      .promise()
      .catch(wrapError('Failed to getItem', params));
  }
  async query(params: DynamoDB.QueryInput) {
    return this.dynamodb
      .query(params)
      .promise()
      .catch(wrapError('Failed to query', params));
  }
  batchGetItem(params: DynamoDB.BatchGetItemInput) {
    return this.dynamodb
      .batchGetItem(params)
      .promise()
      .catch(wrapError('Failed to batchGetItem', params));
  }
  batchWriteItem(params: DynamoDB.BatchWriteItemInput) {
    return this.dynamodb
      .batchWriteItem(params)
      .promise()
      .catch(wrapError('Failed to batchWriteItem', params));
  }
  transactWriteItems(params: DynamoDB.TransactWriteItemsInput) {
    return this.dynamodb
      .transactWriteItems(params)
      .promise()
      .catch(wrapError('Failed to transactWriteItems', params));
  }
}
