import { spawn } from 'child_process';
import program from 'commander';
import { getSpawnOptions, getEnvSettings } from '../helper';

export function init() {
  program
    .command('projects')
    .option('--prod', 'deploy projects to production')
    .option('--stage', 'deploy projects to stage')
    .action(async ({ prod, stage }) => {
      const env = getEnvSettings({ prod, stage });
      spawn('yarn', ['run', 'deploy'], {
        env: {
          ...process.env,
          ...env,
        },
        ...getSpawnOptions('projects'),
      });
    });
}
