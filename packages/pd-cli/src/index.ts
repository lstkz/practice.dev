#!/usr/bin/env ts-node -T

import program from 'commander';
import fs from 'fs';
import path from 'path';

const files = fs.readdirSync(path.join(__dirname, 'commands'));
files.forEach(file => require('./commands/' + file).init());

program.version('0.0.1');

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

process.on('unhandledRejection', (error: any) => {
  console.error(error.stack || error);
  process.exit(1);
});
