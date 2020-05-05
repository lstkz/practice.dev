import dotenv from 'dotenv';

dotenv.config({
  path: '../../.env',
});

if (!process.env.TABLE) {
  throw new Error('TABLE is not set');
}

if (!process.env.TOPIC_ARN) {
  throw new Error('TOPIC_ARN is not set');
}

if (!process.env.TESTER_TOPIC_ARN) {
  throw new Error('TESTER_TOPIC_ARN is not set');
}

if (!process.env.GITHUB_CLIENT_ID) {
  throw new Error('GITHUB_CLIENT_ID is not set');
}

if (!process.env.GITHUB_CLIENT_SECRET) {
  throw new Error('GITHUB_CLIENT_SECRET is not set');
}

if (!process.env.S3_BUCKET_NAME) {
  throw new Error('S3_BUCKET_NAME is not set');
}

if (!process.env.ES_USERNAME) {
  throw new Error('ES_USERNAME is not set');
}

if (!process.env.ES_PASSWORD) {
  throw new Error('ES_PASSWORD is not set');
}

if (!process.env.ES_URL) {
  throw new Error('ES_URL is not set');
}

export const TABLE_NAME =
  process.env.TABLE +
  (process.env.JEST_WORKER_ID ? process.env.JEST_WORKER_ID : '');
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
export const TESTER_TOPIC_ARN = process.env.TESTER_TOPIC_ARN;
export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

export const ES_URL = process.env.JEST_WORKER_ID
  ? 'http://localhost:9200'
  : process.env.ES_URL;
export const ES_USERNAME = process.env.ES_USERNAME;
export const ES_PASSWORD = process.env.ES_PASSWORD;
export const ES_INDEX_PREFIX = process.env.JEST_WORKER_ID
  ? process.env.JEST_WORKER_ID + '_'
  : '';

export const EMAIL_SENDER = 'Practice.dev <no-reply@practice.dev>';

export const BASE_URL = process.env.BASE_URL || 'https://practice.dev';
