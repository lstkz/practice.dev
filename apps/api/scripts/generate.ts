import prettier from 'prettier';
import * as R from 'remeda';
import fs from 'fs';
import Path from 'path';
import {
  CreateRpcBindingOptions,
  CreateEventBindingOptions,
  CreateDynamoStreamBindingOptions,
} from '../src/lib';

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

type RpcBinding = {
  isBinding: boolean;
  type: 'rpc';
  options: CreateRpcBindingOptions;
};

type EventBinding = {
  isBinding: boolean;
  type: 'event';
  options: CreateEventBindingOptions;
};

type DynamoStreamBinding = {
  isBinding: boolean;
  type: 'dynamoStream';
  options: CreateDynamoStreamBindingOptions<any>;
};

type Binding = RpcBinding | EventBinding | DynamoStreamBinding;

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

function createRpcBinding() {
  const entries: string[] = [];

  contracts.forEach(contract => {
    if (!contract.binding.isBinding || contract.binding.type !== 'rpc') {
      return;
    }
    const { file, key, binding } = contract;
    const relativePath = Path.relative(
      Path.join(__dirname, '../src'),
      file
    ).replace(/.ts$/, '');
    const signature = binding.options.signature;
    entries.push(
      `'${signature}': () => import(/* webpackChunkName: "${signature}"*/ '../${relativePath}').then(x => x['${key}']),`
    );
  });

  fs.writeFileSync(
    Path.join(__dirname, '../src/generated/api-mapping.ts'),
    prettier.format(
      `
import { createRpcBinding } from '../lib';

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
}

function createEventBinding() {
  const entries: string[] = [];
  const eventMap: { [x: string]: string[] } = {};

  contracts.forEach(contract => {
    if (!contract.binding.isBinding || contract.binding.type !== 'event') {
      return;
    }
    const { file, key, binding } = contract;
    const relativePath = Path.relative(
      Path.join(__dirname, '../src'),
      file
    ).replace(/.ts$/, '');
    const type = binding.options.type;
    if (!eventMap[type]) {
      eventMap[type] = [];
    }
    eventMap[type].push(
      `'${key}':() => import(/* webpackChunkName: "${type}.${key}"*/ '../${relativePath}').then(x => x['${key}']),`
    );
  });
  Object.keys(eventMap).forEach(type => {
    entries.push(`'${type}': {
      ${eventMap[type].join('\n')}
    }`);
  });

  fs.writeFileSync(
    Path.join(__dirname, '../src/generated/event-mapping.ts'),
    prettier.format(
      `
import { createEventBinding } from '../lib';

type BindingResult = ReturnType<typeof createEventBinding>;

interface EventMapping {
  [x: string]: {
    [x: string]: () => Promise<BindingResult>;
  }
}
export const eventMapping: EventMapping = {
${entries.join('\n')}
}
`,
      { ...require('../../../prettier.config'), parser: 'typescript' }
    )
  );
}
function createDynamoStreamBinding() {
  const entries: string[] = [];
  const dynamoStreamMap: { [x: string]: string[] } = {};

  contracts.forEach(contract => {
    if (
      !contract.binding.isBinding ||
      contract.binding.type !== 'dynamoStream'
    ) {
      return;
    }
    const { file, key, binding } = contract;
    const relativePath = Path.relative(
      Path.join(__dirname, '../src'),
      file
    ).replace(/.ts$/, '');
    const chunkName = R.drop(relativePath.split('/'), 1).join('_');
    const type = binding.options.type;
    if (!dynamoStreamMap[type]) {
      dynamoStreamMap[type] = [];
    }
    dynamoStreamMap[type].push(
      `'${chunkName}_${key}':() => import(/* webpackChunkName: "${chunkName}"*/ '../${relativePath}').then(x => x['${key}']),`
    );
  });
  Object.keys(dynamoStreamMap).forEach(type => {
    entries.push(`'${type}': {
      ${dynamoStreamMap[type].join('\n')}
    }`);
  });

  fs.writeFileSync(
    Path.join(__dirname, '../src/generated/dynamoStream-mapping.ts'),
    prettier.format(
      `
import { createDynamoStreamBinding } from '../lib';

type BindingResult = ReturnType<typeof createDynamoStreamBinding>;

interface DynamoStreamMapping {
  [x: string]: {
    [x: string]: () => Promise<BindingResult>;
  }
}
export const dynamoStreamMapping: DynamoStreamMapping = {
${entries.join(',\n')}
}
`,
      { ...require('../../../prettier.config'), parser: 'typescript' }
    )
  );
}

createRpcBinding();
createEventBinding();
createDynamoStreamBinding();
