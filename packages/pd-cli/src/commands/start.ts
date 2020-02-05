import { spawn } from 'child_process';
import program from 'commander';
import { validateApp, getSpawnOptions } from '../helper';

export function init() {
  program
    .command('start <app>')
    .option('-p, --prod', 'start in production mode')
    .option('-b, --build', 'build app before starting')
    .action(async (app, { prod, build }) => {
      validateApp(app);
      spawn('yarn', ['run', prod ? 'start' : 'dev'], {
        env: {
          ...process.env,
        },
        ...getSpawnOptions(app),
      });
    });
}
