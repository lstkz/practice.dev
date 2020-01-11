import {
  ChallengeDomain,
  ChallengeDifficulty,
  ChallengeStats,
  SubmissionStatus,
} from 'shared';

export interface UserRegisteredEvent {
  type: 'UserRegisteredEvent';
  payload: { userId: string; registeredAt: string };
}

export interface UserEmailConfirmedEvent {
  type: 'UserEmailConfirmedEvent';
  payload: { userId: string };
}

export type AppEvent = UserRegisteredEvent | UserEmailConfirmedEvent;

export interface AppContext {
  user: DbUser | null;
}

export interface DbKey {
  pk: string;
  sk: string;
}

export interface DbUser extends DbKey {
  userId: string;
  email: string;
  username: string;
  salt: string;
  password: string;
  isVerified: boolean;
  githubId?: number;
  isAdmin?: boolean;
}

export interface DbUserEmail extends DbKey {
  userId: string;
  email: string;
}

export interface DbUserUsername extends DbKey {
  userId: string;
  username: string;
}

export interface DbToken extends DbKey {
  userId: string;
}

export interface DbConfirmCode extends DbKey {
  userId: string;
  code: string;
}

export interface DbGithubUser extends DbKey {
  userId: string;
  githubId: number;
}

export interface DbResetPasswordCode extends DbKey {
  userId: string;
  code: string;
  expireAt: number;
}

export interface DbChallenge extends DbKey {
  // challengeId
  data_n: number;
  title: string;
  description: string;
  domain: ChallengeDomain;
  difficulty: ChallengeDifficulty;
  detailsBundleS3Key: string;
  testsBundleS3Key: string;
  createdAt: number;
  tags: string[];
  stats: ChallengeStats;
  testCase: string;
}

export interface DbChallengeSolved extends DbKey {
  userId: string;
  challengeId: number;
  // solvedAt
  data_n: number;
}

export interface DbSolution extends DbKey {
  // createdAt
  data_n: number;
  // likes
  data2_n: number;
  solutionId: string;
  description?: string;
  challengeId: number;
  userId: string;
  title: string;
  slug: string;
  url: string;
  tags: string[];
}

export interface DbRateLimit extends DbKey {
  count: number;
  expireAt: number;
  version: number;
}

export interface DbSocketConnection extends DbKey {
  // createdAt
  data_n: number;
  connectionId: string;
}

export interface DbSubmission extends DbKey {
  submissionId: string;
  // createdAt
  data_n: number;
  challengeId: number;
  userId: string;
  status: SubmissionStatus;
  result?: string;
  testUrl: string;
}

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

/* END LAMBDA TYPES */
