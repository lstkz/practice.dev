import path from 'path';
import fs from 'fs-extra';
import fetch from 'node-fetch';
import AWS from 'aws-sdk';
import { ChallengeInfo } from './_common/types';

const API_URL = process.env.API_URL!;
const API_TOKEN = process.env.API_TOKEN!;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME!;
// const AWS_REGION = process.env.AWS_REGION!;

if (!API_URL) {
  throw new Error('API_URL is not defined');
}

if (!API_TOKEN) {
  throw new Error('API_TOKEN is not defined');
}

if (!S3_BUCKET_NAME) {
  throw new Error('S3_BUCKET_NAME is not defined');
}

// if (!AWS_REGION) {
//   throw new Error('AWS_REGION is not defined');
// }

// AWS.config = new AWS.Config({
//   region: AWS_REGION,
//   apiVersions: {
//     s3: '2006-03-01',
//   },
// });

const s3 = new AWS.S3();

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

async function uploadFile(file: string, prefix: string) {
  const basename = path.basename(file);
  const s3Key = `${prefix}/${basename}`;

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
        Body: await fs.readFile(file),
        ContentType: 'text/javascript',
      })
      .promise();
  }

  return s3Key;
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

Object.values(packageMap).forEach(async pkg => {
  const { name, info, testFile, detailsFile } = pkg;

  try {
    const [detailsS3Key, testsS3Key] = await Promise.all([
      uploadFile(detailsFile!, 'bundle'),
      uploadFile(testFile!, 'tests'),
    ]);

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify({
        query: /* GraphQL */ `
          mutation updateChallenge($values: UpdateChallengeValues!) {
            updateChallenge(values: $values)
          }
        `,
        variables: {
          values: {
            ...info,
            bundle: detailsS3Key,
            tests: testsS3Key,
          },
        },
      }),
    });

    const body = await res.json();
    if (res.status !== 200 || (body.errors && body.errors.length)) {
      console.error('Failed to process ', name);
      console.error(body.errors);
      process.exit(1);
    }
  } catch (e) {
    console.error('Failed to process ', name);
    console.error(e);
    process.exit(1);
  }
});
