import { QueryKey, QueryOperator, DbIndex } from './types';
import { UnreachableCaseError } from '../common/errors';

export function getPropNames(entity: any) {
  return Object.keys(entity).filter(key => {
    return typeof entity[key] !== 'function' && !key.startsWith('__');
  });
}

export function prepareUpdate(entity: any, keys: string[]) {
  const values = keys.reduce((ret, key) => {
    const value = entity[key];
    ret[`:${key}`] = value === undefined ? null : value;
    return ret;
  }, {} as { [x: string]: any });
  const names = keys.reduce((ret, key) => {
    ret[`#${key}`] = key;
    return ret;
  }, {} as { [x: string]: any });

  const mappedKeys = keys.map(key => `#${key} = :${key}`);

  return {
    updateExpression: `SET ${mappedKeys.join(', ')}`,
    expressionValues: values,
    expressionNames: names,
  };
}

interface CreateKeyExpressionOptions {
  pk: {
    name: string;
    value: string;
  };
  sk?: {
    name: string;
    value: [QueryOperator, string | number];
  } | null;
}
export function createKeyExpression(options: CreateKeyExpressionOptions) {
  const { pk, sk } = options;
  const keyExpressionValues: Record<string, any> = {};
  const keyExpressionNames: Record<string, string> = {};
  let keyExpression = `#${pk.name} = :${pk.name}`;
  keyExpressionNames[`#${pk.name}`] = pk.name;
  keyExpressionValues[`:${pk.name}`] = pk.value;
  if (sk) {
    if (sk.value[0] === 'begins_with') {
      keyExpression += ` AND begins_with(#${sk.name}, :${sk.name})`;
    } else {
      keyExpression += ` AND #${sk.name} ${sk.value[0]} :${sk.name}`;
    }
    keyExpressionNames[`#${sk.name}`] = sk.name;
    keyExpressionValues[`:${sk.name}`] = sk.value[1];
  }

  return {
    keyExpression,
    keyExpressionValues,
    keyExpressionNames,
  };
}

export function getKeyExpression(key: QueryKey) {
  if ('pk' in key) {
    return createKeyExpression({
      pk: {
        name: 'pk',
        value: key.pk,
      },
      sk: key.sk
        ? {
            name: 'sk',
            value: key.sk,
          }
        : null,
    });
  }
  if ('data' in key) {
    return createKeyExpression({
      pk: {
        name: 'sk',
        value: key.sk,
      },
      sk: key.data
        ? {
            name: 'data',
            value: key.data,
          }
        : null,
    });
  }
  if ('data_n' in key) {
    return createKeyExpression({
      pk: {
        name: 'sk',
        value: key.sk,
      },
      sk: key.data_n
        ? {
            name: 'data_n',
            value: key.data_n,
          }
        : null,
    });
  }
  if ('data2_n' in key) {
    return createKeyExpression({
      pk: {
        name: 'sk',
        value: key.sk,
      },
      sk: key.data2_n
        ? {
            name: 'data2_n',
            value: key.data2_n,
          }
        : null,
    });
  }
  throw new UnreachableCaseError(key);
}

export function getIndexName(key: QueryKey): DbIndex | undefined {
  if ('pk' in key) {
    return undefined;
  }
  if ('data' in key) {
    return 'sk-data-index';
  }

  if ('data_n' in key) {
    return 'sk-data_n-index';
  }

  if ('data2_n' in key) {
    return 'sk-data2_n-index';
  }

  throw new UnreachableCaseError(key);
}
