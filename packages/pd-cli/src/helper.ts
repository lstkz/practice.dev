import path from 'path';
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
