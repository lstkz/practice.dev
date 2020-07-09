process.env.NODE_ENV = 'test';

import { dynamodb } from './lib';
import { TABLE_NAME } from './config';

import os from 'os';

const cpusCount = os.cpus().length;

if (!process.env.MOCK_DB) {
  throw new Error('MOCK_DB must be set');
}

async function _create(id: number) {
  const name = TABLE_NAME + id;
  const exists = await dynamodb
    .describeTable({
      TableName: name,
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
      TableName: name,
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

export async function createTable() {
  const ids = Array(cpusCount - 1)
    .fill(0)
    .map((_, i) => i + 1);
  await Promise.all(ids.map(_create));
}

async function start() {
  console.time('create');
  await createTable();
  console.timeEnd('create');
}

start();
