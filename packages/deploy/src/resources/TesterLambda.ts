import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import iam = require('@aws-cdk/aws-iam');
import subs = require('@aws-cdk/aws-sns-subscriptions');
import Path from 'path';
import { MainTable } from './MainTable';
import fs from 'fs';
import { MainBucket } from './MainBucket';
import { MainTopic } from './MainTopic';
import { TesterTopic } from './TesterTopic';
import { getLambdaSharedEnv } from '../getLambdaSharedEnv';

interface TesterLambdaDeps {
  mainBucket: MainBucket;
  mainTopic: MainTopic;
  mainTable: MainTable;
  testerTopic: TesterTopic;
}

export class TesterLambda {
  private testerLambda: lambda.Function;
  constructor(scope: cdk.Construct, deps: TesterLambdaDeps) {
    if (
      !fs.existsSync(
        Path.join(__dirname, '../tester-layer/nodejs/node_modules')
      )
    ) {
      throw new Error('node_modules for tester-layer are not installed!');
    }
    const layer = new lambda.LayerVersion(scope, 'TesterLayer', {
      code: lambda.Code.fromAsset(Path.join(__dirname, '../tester-layer')),
      compatibleRuntimes: [lambda.Runtime.NODEJS_10_X],
      license: 'Apache-2.0',
    });
    this.testerLambda = new lambda.Function(scope, `tester-lambda`, {
      code: new lambda.AssetCode(
        Path.join(__dirname, '../../../apps/api/dist')
      ),
      handler: 'app-lambda.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      environment: getLambdaSharedEnv(deps),
      timeout: cdk.Duration.seconds(90),
      memorySize: 1856,
      layers: [layer],
    });

    const testerLambdaPolicy = new iam.PolicyStatement();
    testerLambdaPolicy.addAllResources();
    testerLambdaPolicy.addActions('execute-api:ManageConnections');
    this.testerLambda.addToRolePolicy(testerLambdaPolicy);

    deps.mainTable.getDynamoTable().grantReadWriteData(this.testerLambda);
    deps.mainBucket.getS3Bucket().grantReadWrite(this.testerLambda);
    deps.testerTopic
      .getSNSTopic()
      .addSubscription(new subs.LambdaSubscription(this.testerLambda));

    new cdk.CfnOutput(scope, 'testerLambdaArn', {
      value: this.testerLambda.functionArn,
    });
  }
}
