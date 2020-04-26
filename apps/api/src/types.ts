export interface UserRegisteredEvent {
  type: 'UserRegisteredEvent';
  payload: { userId: number; registeredAt: string };
}

export interface UserEmailConfirmedEvent {
  type: 'UserEmailConfirmedEvent';
  payload: { userId: number };
}

export type AppEvent = UserRegisteredEvent | UserEmailConfirmedEvent;

export type EntityType =
  | 'SolutionEntity'
  | 'SolutionVoteEntity'
  | 'SubmissionEntity'
  | 'ChallengeSolvedEntity';

export type StreamAction = 'INSERT' | 'MODIFY' | 'REMOVE';

export interface DbKey {
  pk: string;
  sk: string;
}

export type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

export type PropsOnly<T> = Omit<
  T,
  FunctionPropertyNames<T> | 'key' | 'colMapping'
>;

/* LAMBDA TYPES */
// from https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/aws-lambda/index.d.ts

export interface APIGatewayEventRequestContext {
  accountId: string;
  apiId: string;
  authorizer?: AuthResponseContext | null;
  connectedAt?: number;
  connectionId?: string;
  domainName?: string;
  eventType?: string;
  extendedRequestId?: string;
  httpMethod: string;
  identity: {
    accessKey: string | null;
    accountId: string | null;
    apiKey: string | null;
    apiKeyId: string | null;
    caller: string | null;
    cognitoAuthenticationProvider: string | null;
    cognitoAuthenticationType: string | null;
    cognitoIdentityId: string | null;
    cognitoIdentityPoolId: string | null;
    sourceIp: string;
    user: string | null;
    userAgent: string | null;
    userArn: string | null;
  };
  messageDirection?: string;
  messageId?: string | null;
  path: string;
  stage: string;
  requestId: string;
  requestTime?: string;
  requestTimeEpoch: number;
  resourceId: string;
  resourcePath: string;
  routeKey?: string;
}

export interface APIGatewayProxyEvent {
  body: string | null;
  headers: { [name: string]: string };
  multiValueHeaders: { [name: string]: string[] };
  httpMethod: string;
  isBase64Encoded: boolean;
  path: string;
  pathParameters: { [name: string]: string } | null;
  queryStringParameters: { [name: string]: string } | null;
  multiValueQueryStringParameters: { [name: string]: string[] } | null;
  stageVariables: { [name: string]: string } | null;
  requestContext: APIGatewayEventRequestContext;
  resource: string;
}

export interface AuthResponseContext {
  [name: string]: any;
}

// SNS "event"
export interface SNSMessageAttribute {
  Type: string;
  Value: string;
}

export interface SNSMessageAttributes {
  [name: string]: SNSMessageAttribute;
}

export interface SNSMessage {
  SignatureVersion: string;
  Timestamp: string;
  Signature: string;
  SigningCertUrl: string;
  MessageId: string;
  Message: string;
  MessageAttributes: SNSMessageAttributes;
  Type: string;
  UnsubscribeUrl: string;
  TopicArn: string;
  Subject: string;
}

export interface SNSEventRecord {
  EventVersion: string;
  EventSubscriptionArn: string;
  EventSource: string;
  Sns: SNSMessage;
}

export interface SNSEvent {
  Records: SNSEventRecord[];
}

export interface ALBEventRequestContext {
  elb: {
    targetGroupArn: string;
  };
  requestId: undefined;
}
export interface ALBEvent {
  requestContext: ALBEventRequestContext;
  httpMethod: string;
  path: string;
  queryStringParameters?: { [parameter: string]: string }; // URL encoded
  headers?: { [header: string]: string };
  multiValueQueryStringParameters?: { [parameter: string]: string[] }; // URL encoded
  multiValueHeaders?: { [header: string]: string[] };
  body: string | null;
  isBase64Encoded: boolean;
}

// http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_streams_AttributeValue.html
export interface AttributeValue {
  B?: string;
  BS?: string[];
  BOOL?: boolean;
  L?: AttributeValue[];
  M?: { [id: string]: AttributeValue };
  N?: string;
  NS?: string[];
  NULL?: boolean;
  S?: string;
  SS?: string[];
}

// http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_streams_StreamRecord.html
export interface StreamRecord {
  ApproximateCreationDateTime?: number;
  Keys?: { [key: string]: AttributeValue };
  NewImage?: { [key: string]: AttributeValue };
  OldImage?: { [key: string]: AttributeValue };
  SequenceNumber?: string;
  SizeBytes?: number;
  StreamViewType?:
    | 'KEYS_ONLY'
    | 'NEW_IMAGE'
    | 'OLD_IMAGE'
    | 'NEW_AND_OLD_IMAGES';
}

// http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_streams_Record.html
export interface DynamoDBRecord {
  awsRegion?: string;
  dynamodb?: StreamRecord;
  eventID?: string;
  eventName?: 'INSERT' | 'MODIFY' | 'REMOVE';
  eventSource?: string;
  eventSourceARN?: string;
  eventVersion?: string;
  userIdentity?: any;
}

// http://docs.aws.amazon.com/lambda/latest/dg/eventsources.html#eventsources-ddb-update
export interface DynamoDBStreamEvent {
  Records: DynamoDBRecord[];
}
/* END LAMBDA TYPES */
