import {
  APIGatewayProxyEvent,
  SNSEvent,
  DynamoDBStreamEvent,
  CloudWatchLogsEvent,
} from '../types';
import { TESTER_TOPIC_ARN } from '../config';

type AWSEvent =
  | SNSEvent
  | APIGatewayProxyEvent
  | DynamoDBStreamEvent
  | CloudWatchLogsEvent;

function isSnsEvent(event: AWSEvent): event is SNSEvent {
  return (
    'Records' in event && event.Records.length > 0 && 'Sns' in event.Records[0]
  );
}

function isDynamoStreamEvent(event: AWSEvent): event is DynamoDBStreamEvent {
  return (
    'Records' in event &&
    event.Records.length > 0 &&
    'dynamodb' in event.Records[0]
  );
}

export function handler(event: AWSEvent, _: any, __: any) {
  if (isDynamoStreamEvent(event)) {
    return import(
      /* webpackChunkName: "dynamoStream" */
      './dynamoStream'
    ).then(module => module.handler(event));
  } else if (isSnsEvent(event)) {
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
  } else if ('awslogs' in event) {
    return import(
      /* webpackChunkName: "log" */
      './log'
    ).then(module => module.logHandler(event));
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
