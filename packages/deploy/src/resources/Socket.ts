import apigateway = require('@aws-cdk/aws-apigateway');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');
import { ApiLambda } from './ApiLambda';

interface SocketDeps {
  apiLambda: ApiLambda;
}

export class Socket {
  public url: string = '';

  constructor(stack: cdk.Stack, deps: SocketDeps) {
    const id = 'socket';
    const lambdaFn = deps.apiLambda.getLambdaFunction();
    const api = new apigateway.CfnApiV2(stack, id, {
      routeSelectionExpression: 'none',
      protocolType: 'WEBSOCKET',
    });

    const integration = new apigateway.CfnIntegrationV2(
      stack,
      'socketIntegration',
      {
        apiId: api.ref,
        integrationType: apigateway.IntegrationType.AWS_PROXY,
        integrationUri: `arn:${stack.partition}:apigateway:${stack.region}:lambda:path/2015-03-31/functions/${lambdaFn.functionArn}/invocations`,
      }
    );

    const route = new apigateway.CfnRouteV2(stack, 'socketRoute', {
      apiId: api.ref,
      routeKey: '$default',
      authorizationType: apigateway.AuthorizationType.NONE,
      target: `integrations/${integration.ref}`,
    });

    const routeConnect = new apigateway.CfnRouteV2(
      stack,
      'socketRouteConnect',
      {
        apiId: api.ref,
        routeKey: '$connect',
        authorizationType: apigateway.AuthorizationType.NONE,
        target: `integrations/${integration.ref}`,
      }
    );

    const routeDisconnect = new apigateway.CfnRouteV2(
      stack,
      'socketRouteDisconnect',
      {
        apiId: api.ref,
        routeKey: '$disconnect',
        authorizationType: apigateway.AuthorizationType.NONE,
        target: `integrations/${integration.ref}`,
      }
    );

    const deployment = new apigateway.CfnDeploymentV2(
      stack,
      'socketDeployment',
      {
        apiId: api.ref,
      }
    );
    const stage = new apigateway.CfnStageV2(stack, 'socketStage', {
      apiId: api.ref,
      stageName: 'socket',
      deploymentId: deployment.ref,
      autoDeploy: true,
    });

    new lambda.CfnPermission(stack, 'socketInvoke', {
      action: 'lambda:InvokeFunction',
      functionName: lambdaFn.functionArn,
      principal: 'apigateway.amazonaws.com',
      sourceArn: `arn:aws:execute-api:${stack.region}:${stack.account}:${api.ref}/*/*`,
    });

    integration.addDependsOn(api);
    route.addDependsOn(integration);
    routeConnect.addDependsOn(integration);
    routeDisconnect.addDependsOn(integration);
    deployment.addDependsOn(route);
    deployment.addDependsOn(routeConnect);
    deployment.addDependsOn(routeDisconnect);
    stage.addDependsOn(deployment);

    this.url = `wss://${api.ref}.execute-api.${stack.region}.amazonaws.com/${stage.stageName}`;

    new cdk.CfnOutput(stack, 'socketUrl', {
      value: this.url,
    });
  }
}
