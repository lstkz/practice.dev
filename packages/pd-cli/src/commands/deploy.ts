import { spawn } from 'child_process';
import program from 'commander';
import { getSpawnOptions, getEnvSettings } from '../helper';
import { build as buildApp } from './build';

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
      );
    });
}
