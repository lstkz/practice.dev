import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import s3 = require('@aws-cdk/aws-s3');
import { PolicyStatement, Effect } from '@aws-cdk/aws-iam';
import Path = require('path');
import fs = require('fs');

if (!process.env.E2E_STACK_NAME) {
  throw new Error('E2E_STACK_NAME is not set');
}
class MainStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);
    const e2eLayerDir = Path.join(__dirname, 'e2e-layer');
    if (!fs.existsSync(Path.join(e2eLayerDir, 'nodejs/node_modules'))) {
      throw new Error('node_modules for e2e-layer are not installed!');
    }

    const bucket = new s3.Bucket(this, 'test-build', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      websiteErrorDocument: 'index.html',
    });

    const layer = new lambda.LayerVersion(this, 'testing-libs', {
      code: lambda.Code.fromAsset(e2eLayerDir),
      compatibleRuntimes: [lambda.Runtime.NODEJS_12_X],
    });

    const fanout = new lambda.Function(this, `fanout`, {
      code: new lambda.AssetCode(Path.join(__dirname, 'e2e-lambdas')),
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'fanout.handler',
      timeout: cdk.Duration.minutes(10),
      memorySize: 3008,
    });

    const testLambda = new lambda.Function(this, `test`, {
      code: new lambda.InlineCode('//placeholder'),
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'src/lambda/test.handler',
      timeout: cdk.Duration.minutes(10),
      layers: [layer],
      memorySize: 3008,
      environment: {
        AWS: '1',
        E2E_WEBSITE_URL: bucket.bucketWebsiteUrl,
        BUCKET_NAME: bucket.bucketName,
      },
    });
    bucket.grantReadWrite(testLambda);

    fanout.addToRolePolicy(
      new PolicyStatement({
        actions: ['lambda:InvokeFunction'],
        resources: ['*'],
        effect: Effect.ALLOW,
      })
    );

    new cdk.CfnOutput(this, 'e2eWebsiteUrl', {
      value: bucket.bucketWebsiteUrl,
    });
    new cdk.CfnOutput(this, 'e2eBucketName', {
      value: bucket.bucketName,
    });
  }
}

(async function () {
  const app = new cdk.App();
  new MainStack(app, process.env.E2E_STACK_NAME!);

  app.synth();
})().catch(e => {
  console.error(e);
  process.exit(1);
});
