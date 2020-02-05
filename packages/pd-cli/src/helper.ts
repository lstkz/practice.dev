import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { ChildProcess } from 'child_process';
import { libs, rootPath, apps } from './config';

function isLib(app: string) {
  return libs.includes(app);
}

export function getAppRoot(app: string) {
  return path.join(rootPath, isLib(app) ? 'packages' : 'apps', app);
}

export function getSpawnOptions(app: string) {
  return {
    shell: true,
    cwd: getAppRoot(app),
    stdio: 'inherit' as const,
  };
}

export function validateApp(app: string) {
  if (apps.includes(app)) {
    return;
  }
  const lines = [`Supported apps: ${apps.join(', ')}`];
  const error = `Invalid app '${app}'.`;
  if (lines.length === 1) {
    console.log(error, lines[0]);
  } else {
    console.log(error);
    console.log(lines.join('\n'));
  }
  console.log(`Invalid app '${app}'.`);
  process.exit(1);
}

export function cpToPromise(cp: ChildProcess) {
  return new Promise((resolve, reject) => {
    cp.addListener('exit', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error('Exited with ' + code));
      }
    });
    cp.addListener('error', e => reject(e));
  });
}

export function getEnvSettings({
  prod,
  stage,
}: {
  prod?: boolean;
  stage?: boolean;
}) {
  const envFile = prod ? '.env-prod' : stage ? '.env-stage' : '.env';
  const content = fs.readFileSync(path.join(rootPath, envFile));
  return dotenv.parse(content);
}

export function updateEnvSettings(
  {
    prod,
    stage,
  }: {
    prod?: boolean;
    stage?: boolean;
  },
  content: dotenv.DotenvParseOutput
) {
  const envFile = prod ? '.env-prod' : stage ? '.env-stage' : '.env';
  const serialized = Object.keys(content)
    .reduce((ret, key) => {
      ret.push(`${key}=${content[key]}`);
      return ret;
    }, [] as string[])
    .join('\n');
  fs.writeFileSync(path.join(rootPath, envFile), serialized);
}
