import { APIGatewayProxyEvent, SNSEvent } from '../types';
import { TESTER_TOPIC_ARN } from '../config';

export function handler(
  event: SNSEvent | APIGatewayProxyEvent,
  _: any,
  __: any
) {
  if ('Records' in event) {
    if (event.Records[0]?.Sns.TopicArn === TESTER_TOPIC_ARN) {
      return import(
        /* webpackChunkName: "tester" */
        './tester'
      ).then(module => module.testerHandler(event));
    } else {
      return import(
        /* webpackChunkName: "event" */
        './event'
      ).then(module => module.handler(event));
    }
  } else if (event.requestContext.connectionId) {
    return import(
      /* webpackChunkName: "socket" */
      './socket'
    ).then(module => module.socketHandler(event));
  } else {
    return import(
      /* webpackChunkName: "rpc" */
      './rpc'
    ).then(module => module.handler(event));
  }
}
