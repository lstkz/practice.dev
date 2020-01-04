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

export const TABLE_NAME = process.env.TABLE;
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
export const TESTER_TOPIC_ARN = process.env.TESTER_TOPIC_ARN;
export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

export const EMAIL_SENDER = 'Practice.dev <no-reply@practice.dev>';

export const BASE_URL = process.env.BASE_URL || 'https://practice.dev';
