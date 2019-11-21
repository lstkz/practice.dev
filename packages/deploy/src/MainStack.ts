import apigateway = require('@aws-cdk/aws-apigateway');
import lambda = require('@aws-cdk/aws-lambda');
import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/core');
import Path from 'path';

export class MainStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);

    const topic = new sns.Topic(this, 'EventBus', {});

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
  }
}

const app = new cdk.App();
new MainStack(app, process.env.STACK_NAME || 'pd-dev');
app.synth();
