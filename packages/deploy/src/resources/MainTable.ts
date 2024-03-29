import cdk = require('@aws-cdk/core');
import dynamodb = require('@aws-cdk/aws-dynamodb');
import { StreamViewType } from '@aws-cdk/aws-dynamodb';

export class MainTable {
  private table: dynamodb.Table;

  constructor(scope: cdk.Construct) {
    this.table = new dynamodb.Table(scope, 'main2', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });
    this.table.addGlobalSecondaryIndex({
      indexName: 'sk-data-index',
      partitionKey: {
        name: 'sk',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'data',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });
    this.table.addGlobalSecondaryIndex({
      indexName: 'sk-data_n-index',
      partitionKey: {
        name: 'sk',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'data_n',
        type: dynamodb.AttributeType.NUMBER,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });
    this.table.addGlobalSecondaryIndex({
      indexName: 'sk-data2_n-index',
      partitionKey: {
        name: 'sk',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'data2_n',
        type: dynamodb.AttributeType.NUMBER,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    new cdk.CfnOutput(scope, 'table', {
      value: this.table.tableName,
    });
  }

  getDynamoTable() {
    return this.table;
  }
}
