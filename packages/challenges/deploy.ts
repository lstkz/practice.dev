import path from 'path';
import * as R from 'remeda';
import fs from 'fs-extra';
import AWS from 'aws-sdk';
import crypto from 'crypto';
import yaml from 'js-yaml';
import { ChallengeInfo } from './_common/types';
import { APIClient, TestInfo } from 'shared';
import { XMLHttpRequest } from 'xmlhttprequest';
import { TestConfiguration, Tester as FrontendTester } from 'tester';
import { ApiTestConfiguration, Tester as ApiTester } from 'tester-api';

function createXHR() {
  return new XMLHttpRequest();
}

const API_URL = process.env.API_URL!;
const API_TOKEN = process.env.API_TOKEN!;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME!;

if (!API_URL) {
  throw new Error('API_URL is not defined');
}

if (!API_TOKEN) {
  throw new Error('API_TOKEN is not defined');
}

if (!S3_BUCKET_NAME) {
  throw new Error('S3_BUCKET_NAME is not defined');
}

const api = new APIClient(API_URL, () => API_TOKEN, createXHR);

const s3 = new AWS.S3();

function md5(data: string) {
  return crypto.createHash('md5').update(data).digest('hex');
}

function getJSFiles(dir: string) {
  return fs
    .readdirSync(dir)
    .filter(file => file.endsWith('.js'))
    .map(file => path.join(dir, file));
}

interface ChallengePackage {
  name: string;
  testFile?: string;
  detailsFile?: string;
  info?: ChallengeInfo;
}

const packageMap: Record<string, ChallengePackage> = {};

function addFiles(distName: string, prop: 'testFile' | 'detailsFile') {
  const files = getJSFiles(path.join(__dirname, './dist/', distName));

  files.forEach(file => {
    const basename = path.basename(file);
    const [sourceDir] = basename.split('.');
    if (!packageMap[sourceDir]) {
      packageMap[sourceDir] = {
        name: sourceDir,
      };
    }
    packageMap[sourceDir][prop] = file;
  });
}

addFiles('details', 'detailsFile');
addFiles('tests', 'testFile');

async function uploadS3(
  content: string | Buffer,
  contentType: string,
  s3Key: string
) {
  const exists = await s3
    .headObject({
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
    })
    .promise()
    .then(
      () => true,
      err => {
        if (err.code === 'NotFound') {
          return false;
        }
        throw err;
      }
    );

  if (!exists) {
    await s3
      .upload({
        Bucket: S3_BUCKET_NAME,
        Key: s3Key,
        Body: content,
        ContentType: contentType,
        ContentLength: content.length,
      })
      .promise();
  }

  return s3Key;
}

async function uploadJSFile(file: string, prefix: string) {
  const basename = path.basename(file);
  const s3Key = `${prefix}/${basename}`;
  return uploadS3(await fs.readFile(file), 'text/javascript', s3Key);
}

fs.readdirSync(path.join(__dirname)).forEach(name => {
  const stats = fs.statSync(path.join(__dirname, name));
  if (!stats.isDirectory()) {
    return;
  }
  if (!/^\d+/.test(name)) {
    return;
  }
  const { info } = require(path.join(__dirname, name, 'info.ts'));
  packageMap[name].info = info;
});

Object.values(packageMap).forEach(pkg => {
  const { name, testFile, info, detailsFile } = pkg;
  if (!detailsFile) {
    throw new Error('Details not found for: ' + name);
  }
  if (!testFile) {
    throw new Error('Tests not found for: ' + name);
  }
  if (!info) {
    throw new Error('Info not found for: ' + name);
  }
});

async function getFrontendTests(testConfiguration: TestConfiguration) {
  const tester = new FrontendTester({
    notify() {
      throw new Error('Not supported');
    },
  });
  await testConfiguration.handler({
    tester,
    url: 'mock',
    createPage: async () => {
      throw new Error('Not implemented');
    },
  });
  const tests: TestInfo[] = tester.tests.map(test => ({
    id: test.id,
    name: test.name,
    result: 'pending' as 'pending',
    steps: [],
  }));
  return tests;
}

async function getApiTests(testConfiguration: ApiTestConfiguration) {
  const tester = new ApiTester({
    notify() {
      throw new Error('Not supported');
    },
  });
  await testConfiguration.handler({
    tester,
    url: 'mock',
  });
  const tests: TestInfo[] = tester.tests.map(test => ({
    id: test.id,
    name: test.name,
    result: 'pending' as 'pending',
    steps: [],
  }));
  return tests;
}

function getTests(info: ChallengeInfo, testFile: string) {
  const testConfiguration = require(testFile!).default;
  switch (info.domain) {
    case 'backend':
      return getApiTests(testConfiguration);
    case 'frontend':
      return getFrontendTests(testConfiguration);
    default:
      throw new Error('Domain not supported: ' + info.domain);
  }
}

async function getAssets(name: string, info: ChallengeInfo) {
  if (!info.hasSwagger) {
    return null;
  }
  const swaggerPath = path.join(__dirname, name, 'details', 'swagger.yaml');
  const content = fs.readFileSync(swaggerPath, 'utf8');
  const hash = md5(content);
  const uploadNameBase = 'assets/' + `${name}-${hash.substr(0, 8)}-swagger`;
  await Promise.all([
    uploadS3(content, 'text/yaml', uploadNameBase + '.yaml'),
    uploadS3(
      JSON.stringify(yaml.load(content)),
      'application/json',
      uploadNameBase + '.json'
    ),
  ]);
  return {
    swagger: uploadNameBase,
  };
}

Object.values(packageMap).forEach(async pkg => {
  const { name, info, testFile, detailsFile } = pkg;

  try {
    const tests = await getTests(info!, testFile!);
    const [detailsS3Key, testsS3Key, assets] = await Promise.all([
      uploadJSFile(detailsFile!, 'bundle'),
      uploadJSFile(testFile!, 'tests'),
      getAssets(name, info!),
    ]);

    await api
      .challenge_updateChallenge({
        ...R.pick(info!, [
          'id',
          'title',
          'description',
          'tags',
          'domain',
          'difficulty',
        ]),
        testCase: JSON.stringify(tests),
        detailsBundleS3Key: detailsS3Key!,
        testsBundleS3Key: testsS3Key!,
        assets,
      })
      .toPromise();
  } catch (e) {
    console.error('Failed to process ', name);
    console.error(e);
    process.exit(1);
  }
});
