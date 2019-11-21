import apigateway = require('@aws-cdk/aws-apigateway');
import lambda = require('@aws-cdk/aws-lambda');
import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/core');
import dynamodb = require('@aws-cdk/aws-dynamodb');
import Path from 'path';

export class MainStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);

    const topic = new sns.Topic(this, 'EventBus', {});

    const table = new dynamodb.Table(this, 'main', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });
    table.addGlobalSecondaryIndex({
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
    table.addGlobalSecondaryIndex({
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

    const apiLambda = new lambda.Function(this, `api-lambda`, {
      code: new lambda.AssetCode(
        Path.join(__dirname, '../../../apps/api/dist')
      ),
      handler: 'app-lambda.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      environment: {
        NODE_ENV: 'production',
        TOPIC_ARN: topic.topicArn,
      },
      timeout: cdk.Duration.seconds(7),
      memorySize: 512,
    });

    topic.grantPublish(apiLambda);

    const api = new apigateway.RestApi(this, 'api', {
      restApiName: `api`,
    });

    const resource = api.root.addResource('{proxy+}');

    const apiLambdaIntegration = new apigateway.LambdaIntegration(apiLambda);
    resource.addMethod('POST', apiLambdaIntegration);

    new cdk.CfnOutput(this, 'apiLambdaArn', {
      value: apiLambda.functionArn,
    });

    new cdk.CfnOutput(this, 'apiUrl', {
      value: api.url,
    });

    new cdk.CfnOutput(this, 'table', {
      value: table.tableName,
    });
  }
}

const app = new cdk.App();
new MainStack(app, process.env.STACK_NAME || 'pd-test');
app.synth();
