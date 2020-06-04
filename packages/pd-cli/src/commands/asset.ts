import program from 'commander';
import Path from 'path';
import dotenv from 'dotenv';
import { uploadAsset } from '@pvd/tools';
import { rootPath } from '../config';

export function init() {
  program.command('asset <path>').action(async path => {
    dotenv.config({
      path: Path.join(rootPath, '.env-prod'),
    });
    const url = await uploadAsset(path);
    console.log(url);
  });
}
