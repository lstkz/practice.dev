import { spawn } from 'child_process';
import program from 'commander';
import {
  getSpawnOptions,
  getEnvSettings,
  cpToPromise,
  getStack,
  getStackOutput,
} from '../helper';

export function init() {
  program
    .command('e2e-deploy')
    .option('--update-env', 'update env')
    .action(async ({ updateEnv }) => {
      const env = getEnvSettings({});

      await cpToPromise(
        spawn(
          'cdk',
          [
            'bootstrap',
            '--app',
            '"yarn workspace deploy run ts-node -T src/E2EStack"',
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
      if (updateEnv) {
        const stack = await getStack(env.E2E_STACK_NAME);
        const getOutput = (name: string) => {
          return getStackOutput(stack, name);
        };
        env.E2E_WEBSITE_URL = getOutput('e2eWebsiteUrl');
        env.E2E_BUCKET_NAME = getOutput('e2eBucketName');
      }
    });
}
