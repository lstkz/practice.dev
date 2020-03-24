import { Converter, AttributeMap, Put, Delete } from 'aws-sdk/clients/dynamodb';
import { TABLE_NAME } from '../config';
import { DbKey, PropsOnly } from '../types';

export interface EntityWithKey<TKey> {
  new (values: any): any;
  createKey(key: TKey): DbKey;
}

export abstract class BaseEntity {
  constructor(values: any, private colMapping: any = {}) {
    const reverseMap: any = {};
    Object.keys(colMapping).forEach(key => {
      reverseMap[colMapping[key]] = key;
    });
    Object.keys(values)
      .filter(key => !['pk', 'sk'].includes(key))
      .forEach(key => {
        const classKey = reverseMap[key] || key;
        (this as any)[classKey] = values[key];
      });
  }

  abstract get key(): { pk: string; sk: string };

  protected getProps() {
    const values: any = {};
    const names = this.getPropNames();
    names.forEach(name => {
      const mapped = this.colMapping[name] || name;
      values[mapped] = (this as any)[name];
    });
    return values;
  }

  serialize(): AttributeMap {
    const values: any = {
      ...this.key,
    };
    const names = this.getPropNames();
    names.forEach(name => {
      const mapped = this.colMapping[name] || name;
      values[mapped] = (this as any)[name];
    });
    return Converter.marshall(values);
  }

  preparePut(): Put {
    return {
      Item: this.serialize(),
      TableName: TABLE_NAME,
    };
  }

  prepareDelete(): Delete {
    return {
      Key: Converter.marshall(this.key),
      TableName: TABLE_NAME,
    };
  }

  prepareUpdate(keys: Array<keyof PropsOnly<this>>) {
    const values = keys.reduce((ret, key) => {
      const value = (this as any)[key];
      ret[`:${key}`] = value === undefined ? null : value;
      return ret;
    }, {} as { [x: string]: any });
    const names = keys.reduce((ret, key) => {
      ret[`#${key}`] = key;
      return ret;
    }, {} as { [x: string]: any });

    const mappedKeys = keys.map(key => `#${key} = :${key}`);

    return {
      Key: Converter.marshall(this.key),
      UpdateExpression: `SET ${mappedKeys.join(', ')}`,
      TableName: TABLE_NAME,
      ExpressionAttributeValues: Converter.marshall(values),
      ExpressionAttributeNames: names,
    };
  }

  private getPropNames() {
    return Object.keys(this).filter(key => {
      return typeof (this as any)[key] !== 'function' && key !== 'key';
    });
  }

  static createKey(_: any): any {
    throw new Error('Not implemented');
  }
}