import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import iam = require('@aws-cdk/aws-iam');
import Path from 'path';
import subs = require('@aws-cdk/aws-sns-subscriptions');
import { DynamoEventSource } from '@aws-cdk/aws-lambda-event-sources';
import { MainTable } from './MainTable';
import { getLambdaSharedEnv } from '../getLambdaSharedEnv';
import { TesterTopic } from './TesterTopic';
import { MainTopic } from './MainTopic';
import { MainBucket } from './MainBucket';
import { appsDir } from '../helper';
import { StartingPosition } from '@aws-cdk/aws-lambda';

interface ApiLambdaDeps {
  mainBucket: MainBucket;
  mainTopic: MainTopic;
  mainTable: MainTable;
  testerTopic: TesterTopic;
}

export class ApiLambda {
  private apiLambda: lambda.Function;
  constructor(scope: cdk.Construct, initOnly: boolean, deps: ApiLambdaDeps) {
    this.apiLambda = new lambda.Function(scope, `api-lambda`, {
      code: initOnly
        ? new lambda.InlineCode('//init placeholder')
        : new lambda.AssetCode(Path.join(appsDir, 'api/dist')),
      handler: 'app-lambda.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
      environment: initOnly ? {} : getLambdaSharedEnv(deps),
      timeout: cdk.Duration.seconds(7),
      memorySize: 512,
    });

    const apiLambdaPolicy = new iam.PolicyStatement();
    apiLambdaPolicy.addAllResources();
    apiLambdaPolicy.addActions('ses:sendEmail');
    this.apiLambda.addToRolePolicy(apiLambdaPolicy);

    deps.mainTable.getDynamoTable().grantReadWriteData(this.apiLambda);
    deps.mainTopic.getSNSTopic().grantPublish(this.apiLambda);
    deps.testerTopic.getSNSTopic().grantPublish(this.apiLambda);
    deps.mainBucket.getS3Bucket().grantReadWrite(this.apiLambda);

    deps.mainTopic
      .getSNSTopic()
      .addSubscription(new subs.LambdaSubscription(this.apiLambda));

    this.apiLambda.addEventSource(
      new DynamoEventSource(deps.mainTable.getDynamoTable(), {
        batchSize: 100,
        startingPosition: StartingPosition.TRIM_HORIZON,
      })
    );

    new cdk.CfnOutput(scope, 'apiLambdaArn', {
      value: this.apiLambda.functionArn,
    });
  }

  getLambdaFunction() {
    return this.apiLambda;
  }
}
