import * as R from 'remeda';
import AWS from 'aws-sdk';
import path from 'path';
import fs from 'fs';
import { runTests as runFrontedTests } from 'tester';
import { runTests as runApiTests } from 'tester-api';
import { getUserSocketConnections } from '../contracts/socket/getUserSocketConnections';
import { SocketNotifier } from '../tester/SocketNotifier';
import { DbNotifier } from '../tester/DbNotifier';
import { MultiNotifier } from '../tester/MultiNotifier';
import { SNSEvent } from '../types';
import { TesterMessage } from 'shared';
import { s3 } from '../lib';
import { S3_BUCKET_NAME } from '../config';

import('aws-sdk/clients/apigatewaymanagementapi');

if (!process.env.SOCKET_ENDPOINT) {
  throw new Error('SOCKET_ENDPOINT is not defined');
}

export async function testerHandler(event: SNSEvent) {
  if (event.Records.length !== 1) {
    throw new Error('Expected exactly 1 Record');
  }
  const record = event.Records[0];
  const msg: TesterMessage = JSON.parse(record.Sns.Message);

  const connections = await getUserSocketConnections(msg.userId);

  const api = new AWS.ApiGatewayManagementApi({
    region: 'eu-central-1',
    apiVersion: '2018-11-29',
    endpoint: process.env.SOCKET_ENDPOINT,
  });

  const s3Object = await s3
    .getObject({
      Bucket: S3_BUCKET_NAME,
      Key: msg.tests,
    })
    .promise();
  const testName = R.last(msg.tests.split('/'));
  const testPath = path.join('/tmp', testName);
  fs.writeFileSync(testPath, s3Object.Body);

  const socketNotifier = new SocketNotifier(api, connections);
  const dbNotifier = new DbNotifier(msg.id);
  const multiNotifier = new MultiNotifier([socketNotifier, dbNotifier]);

  const requireFunc =
    typeof __webpack_require__ === 'function'
      ? __non_webpack_require__
      : require;
  if (msg.type === 'frontend') {
    await runFrontedTests(
      msg.id,
      msg.testUrl,
      requireFunc(testPath).default,
      multiNotifier
    );
  } else {
    await runApiTests(
      msg.id,
      msg.testUrl,
      requireFunc(testPath).default,
      multiNotifier
    );
  }
}
