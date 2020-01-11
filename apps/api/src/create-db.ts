import { dynamodb } from './lib';
import { TABLE_NAME } from './config';

export async function createTable() {
  const exists = await dynamodb
    .describeTable({
      TableName: TABLE_NAME,
    })
    .promise()
    .then(
      () => true,
      () => false
    );
  if (exists) {
    return;
  }
  await dynamodb
    .createTable({
      TableName: TABLE_NAME,
      BillingMode: 'PAY_PER_REQUEST',
      KeySchema: [
        {
          AttributeName: 'pk',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'sk',
          KeyType: 'RANGE',
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'data',
          AttributeType: 'S',
        },
        {
          AttributeName: 'data_n',
          AttributeType: 'N',
        },
        {
          AttributeName: 'data2_n',
          AttributeType: 'N',
        },
        {
          AttributeName: 'pk',
          AttributeType: 'S',
        },
        {
          AttributeName: 'sk',
          AttributeType: 'S',
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'sk-data-index',
          KeySchema: [
            {
              AttributeName: 'sk',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'data',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 0,
            WriteCapacityUnits: 0,
          },
        },
        {
          IndexName: 'sk-data_n-index',
          KeySchema: [
            {
              AttributeName: 'sk',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'data_n',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 0,
            WriteCapacityUnits: 0,
          },
        },
        {
          IndexName: 'sk-data2_n-index',
          KeySchema: [
            {
              AttributeName: 'sk',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'data2_n',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 0,
            WriteCapacityUnits: 0,
          },
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 0,
        WriteCapacityUnits: 0,
      },
    })
    .promise();
}

async function start() {
  console.time('create');
  await createTable();
  console.timeEnd('create');
}

start();
