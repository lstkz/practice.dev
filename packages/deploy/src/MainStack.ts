import apigateway = require('@aws-cdk/aws-apigateway');
import lambda = require('@aws-cdk/aws-lambda');
import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/core');
import ses = require('@aws-cdk/aws-ses');
import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import dynamodb = require('@aws-cdk/aws-dynamodb');
import subs = require('@aws-cdk/aws-sns-subscriptions');
import cf = require('@aws-cdk/aws-cloudfront');
import s3deploy = require('@aws-cdk/aws-s3-deployment');
import Path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';
import { Socket } from './Socket';

dotenv.config({
  path: Path.join(__dirname, '../../../.env-prod'),
});

if (!process.env.GITHUB_CLIENT_ID) {
  throw new Error('GITHUB_CLIENT_ID is not set');
}

if (!process.env.GITHUB_CLIENT_SECRET) {
  throw new Error('GITHUB_CLIENT_SECRET is not set');
}

if (!process.env.API_GATEWAY_ENDPOINT) {
  throw new Error('API_GATEWAY_ENDPOINT is not set');
}

if (
  !fs.existsSync(Path.join(__dirname, '../tester-layer/nodejs/node_modules'))
) {
  throw new Error('node_modules for tester-layer are not installed!');
}

export class MainStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);
  }
  async create() {
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
      API_GATEWAY_ENDPOINT: process.env.API_GATEWAY_ENDPOINT!,
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
      compatibleRuntimes: [lambda.Runtime.NODEJS_10_X],
      license: 'Apache-2.0',
    });

    const testerLambda = new lambda.Function(this, `tester-lambda`, {
      code: new lambda.AssetCode(
        Path.join(__dirname, '../../../apps/api/dist')
      ),
      handler: 'app-lambda.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      environment: envVariables,
      timeout: cdk.Duration.seconds(90),
      memorySize: 1856,
      layers: [layer],
    });

    const apiLambdaPolicy = new iam.PolicyStatement();
    apiLambdaPolicy.addAllResources();
    apiLambdaPolicy.addActions('ses:sendEmail');
    apiLambda.addToRolePolicy(apiLambdaPolicy);

    const testerLambdaPolicy = new iam.PolicyStatement();
    testerLambdaPolicy.addAllResources();
    testerLambdaPolicy.addActions('execute-api:ManageConnections');
    testerLambda.addToRolePolicy(testerLambdaPolicy);

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
      minimumCompressionSize: 0,
    });

    const resource = api.root.addResource('{proxy+}');

    const apiLambdaIntegration = new apigateway.LambdaIntegration(apiLambda);
    resource.addMethod('ANY', apiLambdaIntegration);

    const socket = new Socket(this, 'socket', apiLambda);

    const cfIdentity = new cf.OriginAccessIdentity(
      this,
      'CloudFrontOriginAccessIdentity',
      {}
    );

    bucket.grantRead(cfIdentity);

    const deployBucket = new s3.Bucket(this, 'DeployBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
      cors: [
        {
          allowedOrigins: ['*'],
          allowedMethods: [s3.HttpMethods.GET],
        },
      ],
    });

    const distribution = new cf.CloudFrontWebDistribution(this, 'WebSite', {
      priceClass: cf.PriceClass.PRICE_CLASS_100,
      httpVersion: cf.HttpVersion.HTTP2,
      enableIpV6: true,
      errorConfigurations: [
        {
          errorCode: 403,
          errorCachingMinTtl: 1,
          responsePagePath: '/index.html',
          responseCode: 200,
        },
      ],
      viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      aliasConfiguration:
        process.env.DOMAIN_CERT && process.env.DOMAIN
          ? {
              acmCertRef: process.env.DOMAIN_CERT,
              names: [process.env.DOMAIN],
            }
          : undefined,
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: deployBucket,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              forwardedValues: {
                cookies: {
                  forward: 'none',
                },
                queryString: false,
              },
              compress: true,
              allowedMethods: cf.CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
              cachedMethods: cf.CloudFrontAllowedCachedMethods.GET_HEAD_OPTIONS,
            },
          ],
        },
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity: cfIdentity,
          },
          originPath: '',
          behaviors: [
            {
              pathPattern: '/bundle/*',
              forwardedValues: {
                cookies: {
                  forward: 'none',
                },
                queryString: false,
              },

              compress: true,
              allowedMethods: cf.CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
              cachedMethods: cf.CloudFrontAllowedCachedMethods.GET_HEAD_OPTIONS,
            },
          ],
        },
      ],
    });
    const frontendDir = Path.join(__dirname, '../../../apps/front/build');

    new s3deploy.BucketDeployment(this, 'DeployS3', {
      memoryLimit: 512,
      sources: [s3deploy.Source.asset(frontendDir)],
      destinationBucket: deployBucket,
      distribution,
      distributionPaths: ['/index.html'],
      contentEncoding: '',
    });

    new cdk.CfnOutput(this, 'deployBucket', {
      value: deployBucket.bucketDomainName,
    });

    new cdk.CfnOutput(this, 'domainName', {
      value: distribution.domainName,
    });

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

    new cdk.CfnOutput(this, 'socketUrl', {
      value: socket.url,
    });
  }
}

(async function() {
  const app = new cdk.App();
  const stack = new MainStack(app, process.env.STACK_NAME || 'pd-test');
  await stack.create();

  app.synth();
})();
