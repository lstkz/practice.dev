import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import iam = require('@aws-cdk/aws-iam');
import Path from 'path';
import subs = require('@aws-cdk/aws-sns-subscriptions');
import { MainTable } from './MainTable';
import { getLambdaSharedEnv } from '../getLambdaSharedEnv';
import { TesterTopic } from './TesterTopic';
import { MainTopic } from './MainTopic';
import { MainBucket } from './MainBucket';

interface ApiLambdaDeps {
  mainBucket: MainBucket;
  mainTopic: MainTopic;
  mainTable: MainTable;
  testerTopic: TesterTopic;
}

export class ApiLambda {
  private apiLambda: lambda.Function;
  constructor(scope: cdk.Construct, deps: ApiLambdaDeps) {
    this.apiLambda = new lambda.Function(scope, `api-lambda`, {
      code: new lambda.AssetCode(
        Path.join(__dirname, '../../../apps/api/dist')
      ),
      handler: 'app-lambda.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      environment: getLambdaSharedEnv(deps),
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

    new cdk.CfnOutput(scope, 'apiLambdaArn', {
      value: this.apiLambda.functionArn,
    });
  }

  getLambdaFunction() {
    return this.apiLambda;
  }
}
