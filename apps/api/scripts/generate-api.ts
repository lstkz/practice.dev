import prettier from 'prettier';
import * as R from 'remeda';
import fs from 'fs';
import Path from 'path';
import { CreateRpcBindingOptions } from '../src/lib';

const baseDir = Path.join(__dirname, '../src/contracts');

function walk(dir: string) {
  const results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = Path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results.push(...walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

type Binding = {
  isBinding: boolean;
  type: 'rpc';
  options: CreateRpcBindingOptions;
};

interface ContractInfo {
  file: string;
  key: string;
  binding: Binding;
}

const contracts: ContractInfo[] = R.flatMap(walk(baseDir), file => {
  const entries = Object.entries(require(file)) as Array<[string, Binding]>;
  return entries.map(([key, binding]) => ({
    file,
    key,
    binding,
  }));
});

const entries: string[] = [];

contracts
  .filter(item => item.binding.isBinding && item.binding.type === 'rpc')
  .forEach(({ file, key, binding }) => {
    const relativePath = Path.relative(
      Path.join(__dirname, '../src'),
      file
    ).replace(/.ts$/, '');
    const signature = binding.options.signature;
    entries.push(
      `'${signature}': () => import(/* webpackChunkName: "${signature}"*/ './${relativePath}').then(x => x['${key}']),`
    );
  });

fs.writeFileSync(
  Path.join(__dirname, '../src/api-mapping.ts'),
  prettier.format(
    `
import { createRpcBinding } from './lib';

type BindingResult = ReturnType<typeof createRpcBinding>;

interface ApiMapping {
  [x: string]: () => Promise<BindingResult>;
}
export const apiMapping: ApiMapping = {
${entries.join('\n')}
}
`,
    { ...require('../../../prettier.config'), parser: 'typescript' }
  )
);
