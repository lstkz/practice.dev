import AWS from 'aws-sdk';
import { spawn } from 'child_process';
import program from 'commander';
import Path from 'path';
import fs from 'mz/fs';
import {
  getSpawnOptions,
  getEnvSettings,
  cpToPromise,
  walk,
  getAppRoot,
  getStack,
  getStackOutput,
} from '../helper';
import { build as buildApp } from './build';
import mime from 'mime-types';

const s3 = new AWS.S3();

async function uploadS3(bucketName: string) {
  const frontRoot = getAppRoot('front');
  const buildDir = Path.join(frontRoot, 'build');
  const files = walk(buildDir);

  await Promise.all(
    files
      .filter(path => !path.endsWith('.DS_Store'))
      .map(async filePath => {
        const contentType = mime.lookup(filePath);
        if (!contentType) {
          throw new Error('no contentType for ' + filePath);
        }
        const noCache = filePath.endsWith('.html');
        const file = Path.relative(buildDir, filePath);
        await s3
          .upload({
            Bucket: bucketName,
            Key: file.replace(/\\/g, '/'),
            Body: await fs.readFile(filePath),
            ContentType: contentType,
            CacheControl: noCache ? `max-age=0` : undefined,
          })
          .promise();
      })
  );
}

export function init() {
  program
    .command('deploy')
    .option('--prod', 'deploy to production')
    .option('--stage', 'deploy to stage')
    .option('--no-build', 'skip build')
    .action(async ({ prod, stage, build }) => {
      if (build) {
        const buildOptions = { prod, stage };
        await Promise.all([
          buildApp('api', buildOptions),
          buildApp('front', buildOptions),
        ]);
      }
      const env = getEnvSettings({ prod, stage });

      await cpToPromise(
        spawn(
          'cdk',
          [
            'deploy',
            '--app',
            '"yarn workspace deploy run ts-node -T src/MainStack"',
          ],
          {
            env: {
              ...process.env,
              ...env,
            },
            ...getSpawnOptions('deploy'),
          }
        )
      );
      const stack = await getStack(env.STACK_NAME || process.env.STACK_NAME!);
      await uploadS3(getStackOutput(stack, 'deployBucket'));
    });
}
