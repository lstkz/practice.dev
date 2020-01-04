import apigateway = require('@aws-cdk/aws-apigateway');
import lambda = require('@aws-cdk/aws-lambda');
import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/core');
import ses = require('@aws-cdk/aws-ses');
import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import dynamodb = require('@aws-cdk/aws-dynamodb');
import subs = require('@aws-cdk/aws-sns-subscriptions');
import Path from 'path';
import dotenv from 'dotenv';

dotenv.config({
  path: Path.join(__dirname, '../../../.env-prod'),
});

if (!process.env.GITHUB_CLIENT_ID) {
  throw new Error('GITHUB_CLIENT_ID is not set');
}

if (!process.env.GITHUB_CLIENT_SECRET) {
  throw new Error('GITHUB_CLIENT_SECRET is not set');
}

export class MainStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);

    const topic = new sns.Topic(this, 'EventBus', {});
    const testerTopic = new sns.Topic(this, 'Tester', {});
    const bucket = new s3.Bucket(this, 'Bucket', {});

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

    const envVariables = {
      IS_AWS: '1',
      NODE_ENV: 'production',
      TOPIC_ARN: topic.topicArn,
      TESTER_TOPIC_ARN: testerTopic.topicArn,
      TABLE: table.tableName,
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID!,
      GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET!,
      S3_BUCKET_NAME: bucket.bucketName,
    };

    const apiLambda = new lambda.Function(this, `api-lambda`, {
      code: new lambda.AssetCode(
        Path.join(__dirname, '../../../apps/api/dist')
      ),
      handler: 'app-lambda.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      environment: envVariables,
      timeout: cdk.Duration.seconds(7),
      memorySize: 512,
    });

    const layer = new lambda.LayerVersion(this, 'TesterLayer', {
      code: lambda.Code.fromAsset(Path.join(__dirname, '../tester-layer')),
      compatibleRuntimes: [lambda.Runtime.NODEJS_8_10],
      license: 'Apache-2.0',
    });

    const testerLambda = new lambda.Function(this, `tester-lambda`, {
      code: new lambda.AssetCode(
        Path.join(__dirname, '../../../apps/api/dist')
      ),
      handler: 'app-lambda.handler',
      runtime: lambda.Runtime.NODEJS_8_10,
      environment: envVariables,
      timeout: cdk.Duration.seconds(90),
      memorySize: 1856,
      layers: [layer],
    });

    const apiLambdaPolicy = new iam.PolicyStatement();
    apiLambdaPolicy.addAllResources();
    apiLambdaPolicy.addActions('ses:sendEmail');
    apiLambda.addToRolePolicy(apiLambdaPolicy);

    table.grantReadWriteData(apiLambda);
    table.grantReadWriteData(testerLambda);
    topic.grantPublish(apiLambda);
    testerTopic.grantPublish(apiLambda);

    bucket.grantReadWrite(apiLambda);
    bucket.grantReadWrite(testerLambda);

    topic.addSubscription(new subs.LambdaSubscription(apiLambda));
    testerTopic.addSubscription(new subs.LambdaSubscription(testerLambda));

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

    new cdk.CfnOutput(this, 'topicArn', {
      value: topic.topicArn,
    });

    new cdk.CfnOutput(this, 'testerTopicArn', {
      value: testerTopic.topicArn,
    });

    new cdk.CfnOutput(this, 'bucketName', {
      value: bucket.bucketName,
    });
  }
}

const app = new cdk.App();
new MainStack(app, process.env.STACK_NAME || 'pd-test');
app.synth();
