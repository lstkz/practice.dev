import { spawn } from 'child_process';
import program from 'commander';
import {
  getSpawnOptions,
  getEnvSettings,
  cpToPromise,
  updateEnvSettings,
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
        spawn('cdk', ['deploy'], {
          env: {
            ...process.env,
            ...env,
            INIT_STACK: '1',
          },
          ...getSpawnOptions('deploy'),
        })
      );

      const cf = new AWS.CloudFormation();
      const { Stacks: stacks } = await cf
        .describeStacks({
          StackName: env.STACK_NAME,
        })
        .promise();
      const stack = stacks && stacks[0];
      if (!stack) {
        throw new Error(`Stack ${env.STACK_NAME} not found`);
      }
      const getOutput = (name: string) => {
        const output = (stack.Outputs || []).find(x => x.OutputKey === name);
        if (!output) {
          throw new Error(`Output not found: ${output}`);
        }
        if (!output.OutputValue) {
          throw new Error(`Output not set: ${output}`);
        }
        return output.OutputValue;
      };
      env.API_URL = getOutput('apiUrl');
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
