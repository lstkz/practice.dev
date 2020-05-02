import { MainBucket } from './resources/MainBucket';
import { MainTable } from './resources/MainTable';
import { MainTopic } from './resources/MainTopic';
import { TesterTopic } from './resources/TesterTopic';

interface GetLambdaSharedEnvOptions {
  mainBucket: MainBucket;
  mainTopic: MainTopic;
  mainTable: MainTable;
  testerTopic: TesterTopic;
}

export function getLambdaSharedEnv(options: GetLambdaSharedEnvOptions) {
  const { mainBucket, mainTable, testerTopic, mainTopic } = options;

  if (!process.env.GITHUB_CLIENT_ID) {
    throw new Error('GITHUB_CLIENT_ID is not set');
  }

  if (!process.env.GITHUB_CLIENT_SECRET) {
    throw new Error('GITHUB_CLIENT_SECRET is not set');
  }

  if (!process.env.SOCKET_ENDPOINT) {
    throw new Error('SOCKET_ENDPOINT is not set');
  }
  if (!process.env.ES_URL) {
    throw new Error('ES_URL is not set');
  }
  if (!process.env.ES_USERNAME) {
    throw new Error('ES_USERNAME is not set');
  }
  if (!process.env.ES_PASSWORD) {
    throw new Error('ES_PASSWORD is not set');
  }

  return {
    IS_AWS: '1',
    NODE_ENV: 'production',
    TOPIC_ARN: mainTopic.getSNSTopic().topicArn,
    TESTER_TOPIC_ARN: testerTopic.getSNSTopic().topicArn,
    TABLE: mainTable.getDynamoTable().tableName,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    SOCKET_ENDPOINT: process.env.SOCKET_ENDPOINT,
    S3_BUCKET_NAME: mainBucket.getS3Bucket().bucketName,
    ES_URL: process.env.ES_URL,
    ES_USERNAME: process.env.ES_USERNAME,
    ES_PASSWORD: process.env.ES_PASSWORD,
  };
}
