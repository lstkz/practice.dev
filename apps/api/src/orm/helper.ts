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
