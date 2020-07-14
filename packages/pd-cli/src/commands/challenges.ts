import { spawn } from 'child_process';
import Path from 'path';
import program from 'commander';
import { getEnvSettings } from '../helper';
import { rootPath } from '../config';

export function init() {
  program
    .command('challenges')
    .option('--prod', 'deploy challenges to production')
    .option('--stage', 'deploy challenges to stage')
    .action(async ({ prod, stage }) => {
      const env = getEnvSettings({ prod, stage });
      spawn('ts-node', ['-T', 'deploy'], {
        env: {
          ...process.env,
          ...env,
        },
        shell: true,
        cwd: Path.join(rootPath, '../practice-dev-public/challenges'),
        stdio: 'inherit' as const,
      });
    });
}
