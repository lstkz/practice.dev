import path from 'path';
import fs from 'fs-extra';
import AWS from 'aws-sdk';
import crypto from 'crypto';
import { ProjectInfo, ProjectChallengeInfo } from './_common/types';
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

function md5(data: string | Buffer) {
  return crypto.createHash('md5').update(data).digest('hex');
}

interface FileUpload {
  name: string;
  content: Buffer;
}

interface ChallengePackage extends ProjectChallengeInfo {
  detailsFile: FileUpload;
  testFile: FileUpload;
  testFilePath: string;
}

interface ProjectPackage {
  name: string;
  info: ProjectInfo;
  challenges: ChallengePackage[];
}

function _getFileUploadPath(projectName: string, dir: string, id: number) {
  return path.join(__dirname, 'dist', dir, projectName, id + '.js');
}

async function _getFileUpload(
  projectName: string,
  dir: string,
  id: number
): Promise<FileUpload> {
  const content = await fs.readFile(_getFileUploadPath(projectName, dir, id));
  const hash = md5(content);
  return {
    name: `${projectName}-${id}.${hash}.js`,
    content,
  };
}

async function prepareUpload() {
  const dir = fs.readdirSync(__dirname);
  const projectNames = dir.filter(name => {
    const stats = fs.statSync(path.join(__dirname, name));
    return stats.isDirectory() && /^\d\d\d\-/.test(name);
  });
  const ret: ProjectPackage[] = [];

  await Promise.all(
    projectNames.map(async projectName => {
      const info = require(path.join(__dirname, projectName, 'info.ts'))
        .info as ProjectInfo;
      const pkg: ProjectPackage = {
        name: projectName,
        info,
        challenges: await Promise.all(
          info.challenges.map(async challenge => {
            return {
              ...challenge,
              detailsFile: await _getFileUpload(
                projectName,
                'details',
                challenge.id
              ),
              testFile: await _getFileUpload(
                projectName,
                'tests',
                challenge.id
              ),
              testFilePath: _getFileUploadPath(
                projectName,
                'tests',
                challenge.id
              ),
            };
          })
        ),
      };
      ret.push(pkg);
    })
  );

  return ret;
}

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

async function uploadJSFile(upload: FileUpload, prefix: string) {
  const s3Key = `${prefix}/${upload.name}`;
  return uploadS3(upload.content, 'text/javascript', s3Key);
}

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

function getTests(info: ProjectInfo, testFile: string) {
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

async function upload() {
  const packages = await prepareUpload();
  await Promise.all(
    packages.map(async pkg => {
      try {
        const { info } = pkg;
        const challenges = await Promise.all(
          pkg.challenges.map(async challenge => {
            const [
              detailsBundleS3Key,
              testsBundleS3Key,
              tests,
            ] = await Promise.all([
              uploadJSFile(challenge.detailsFile, 'bundle'),
              uploadJSFile(challenge.testFile, 'tests'),
              getTests(info, challenge.testFilePath),
            ]);
            return {
              id: challenge.id,
              title: challenge.title,
              description: challenge.description,
              detailsBundleS3Key,
              testsBundleS3Key,
              testCase: JSON.stringify(tests),
            };
          })
        );
        await api
          .project_updateProject(
            {
              id: info.id,
              title: info.title,
              description: info.description,
              domain: info.domain,
            },
            challenges
          )
          .toPromise();
      } catch (e) {
        console.error('Failed to process ', pkg.name);
        console.error(e);
        process.exit(1);
      }
    })
  );
}
upload();
