import fs from 'fs';
import path from 'path';

function getFile(name: string) {
  const prefix = process.env.FILE_PREFIX || '';
  return path.join('/tmp', prefix + name);
}

module.exports = async function setup(jestConfig: jest.InitialOptions) {
  if (!(jestConfig.watch || jestConfig.watchAll)) {
    const pid = fs.readFileSync(getFile('pid'), 'utf8');
    process.kill(Number(pid));
  }
};
