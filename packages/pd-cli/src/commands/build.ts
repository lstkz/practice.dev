import { spawn } from 'child_process';
import program from 'commander';
import {
  validateApp,
  getSpawnOptions,
  cpToPromise,
  getEnvSettings,
} from '../helper';

export function build(
  app: string,
  { prod, stage }: { prod?: boolean; stage?: boolean }
) {
  validateApp(app);
  return cpToPromise(
    spawn('yarn', ['run', 'build'], {
      env: {
        ...process.env,
        ...getEnvSettings({ prod, stage }),
      },
      ...getSpawnOptions(app),
    })
  );
}

export function init() {
  program
    .command('build <app>')
    .option('--prod', 'use prod settings')
    .option('--stage', 'use stage settings')
    .action(async (app, { prod, stage }) => {
      validateApp(app);
      await build(app, { prod, stage });
    });
}
