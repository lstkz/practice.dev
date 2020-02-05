import { spawn } from 'child_process';
import program from 'commander';
import { getSpawnOptions, getEnvSettings } from '../helper';

export function init() {
  program
    .command('challenges')
    .option('--prod', 'deploy challenges to production')
    .option('--stage', 'deploy challenges to stage')
    .action(async ({ prod, stage }) => {
      const env = getEnvSettings({ prod, stage });
      spawn('yarn', ['run', 'deploy'], {
        env: {
          ...process.env,
          ...env,
        },
        ...getSpawnOptions('challenges'),
      });
    });
}
