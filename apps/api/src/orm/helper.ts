import { Instance } from './types';

export function getPropNames(entity: any) {
  return Object.keys(entity).filter(key => {
    return typeof entity[key] !== 'function' && !key.startsWith('__');
  });
}
