import { spawn } from 'child_process';
import program from 'commander';
import {
  getSpawnOptions,
  getEnvSettings,
  cpToPromise,
  updateEnvSettings,
  getStack,
  getStackOutput,
} from '../helper';
import AWS from 'aws-sdk';

export function init() {
  program
    .command('init')
    .option('--prod', 'deploy to production')
    .option('--stage', 'deploy to stage')
    .action(async ({ prod, stage, build }) => {
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
              INIT_STACK: '1',
            },
            ...getSpawnOptions('deploy'),
          }
        )
      );
      const stack = await getStack(env.STACK_NAME);
      const getOutput = (name: string) => {
        return getStackOutput(stack, name);
      };
      env.API_URL = getOutput('apiUrl');
      env.SOCKET_URL = getOutput('socketUrl');
      env.S3_BUCKET_NAME = getOutput('bucketName');
      env.TESTER_TOPIC_ARN = getOutput('testerTopicArn');
      env.TOPIC_ARN = getOutput('topicArn');
      env.SOCKET_ENDPOINT = getOutput('socketUrl').replace('wss://', '');
      env.TABLE = getOutput('table');

      const addDefault = (name: string) => {
        if (!env[name]) {
          env[name] = '';
        }
      };

      addDefault('GITHUB_CLIENT_ID');
      addDefault('GITHUB_CLIENT_SECRET');
      addDefault('GOOGLE_CLIENT_ID');
      addDefault('GOOGLE_CLIENT_SECRET');
      addDefault('API_TOKEN');

      updateEnvSettings({ prod, stage }, env);
    });
}
