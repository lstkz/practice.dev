import cdk = require('@aws-cdk/core');
import apigateway = require('@aws-cdk/aws-apigateway');
import { ApiLambda } from './ApiLambda';

interface GatewayApiDeps {
  apiLambda: ApiLambda;
}

export class GatewayApi {
  constructor(scope: cdk.Construct, deps: GatewayApiDeps) {
    const api = new apigateway.RestApi(scope, 'api', {
      restApiName: `api`,
      minimumCompressionSize: 0,
    });

    const resource = api.root.addResource('{proxy+}');

    const apiLambdaIntegration = new apigateway.LambdaIntegration(
      deps.apiLambda.getLambdaFunction()
    );
    resource.addMethod('ANY', apiLambdaIntegration);

    new cdk.CfnOutput(scope, 'apiUrl', {
      value: api.url,
    });
  }
}
