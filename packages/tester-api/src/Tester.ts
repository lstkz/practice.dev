import https from 'https';
import * as R from 'remeda';
import http from 'http';
import Url from 'url';
import qs from 'querystring';
import crypto from 'crypto';
import { Schema, Convert, getValidateResult } from 'schema';
import { TestError } from './TestError';
import { formatErrors } from 'schema/src/utils';

const defaultTimeout = 3500;
const maxBodyLength = 1 * 1024 * 1024;

type TestResult = 'pass' | 'fail' | 'pending';

interface Test {
  id: number;
  name: string;
  result: TestResult;
  exec: () => Promise<void>;
}

interface StepNotifier {
  notify(text: string, data?: any): Promise<void>;
}

export interface MakeRequestOptions {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  params?: any;
  query?: any;
}

interface MakeUrlOptions {
  baseUrl: string;
  path: string;
  query?: any;
  params?: any;
}

function makeUrl(options: MakeUrlOptions) {
  const { baseUrl, path, query, params } = options;
  let url = `${baseUrl}${path}`;
  if (params) {
    Object.entries(params).forEach(([name, value]) => {
      url = url.replace(':' + name, encodeURIComponent(String(value)));
    });
  }
  if (query && Object.keys(query).length) {
    url += '?' + qs.stringify(query);
  }

  return url;
}

function getRequest(url: string) {
  if (url.startsWith('http://')) {
    return http.request.bind(http);
  }
  if (url.startsWith('https://')) {
    return https.request.bind(https);
  }
  throw new Error('Not supported protocol');
}

function tryParse(data: any) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
}

export class Tester {
  tests: Test[] = [];
  baseUrl: string | null = null;
  private nextId = 1;

  constructor(private stepNotifier: StepNotifier) {}

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  private getBaseUrl() {
    if (!this.baseUrl) {
      throw new Error('baseUrl not set');
    }
    return this.baseUrl;
  }

  test(name: string, fn: () => Promise<void>) {
    const test: Test = {
      id: this.tests.length + 1,
      name,
      result: 'pending',
      exec: fn,
    };
    this.tests.push(test);
  }

  async makeRequest(options: MakeRequestOptions) {
    const id = this.nextId++;
    const url = makeUrl({
      baseUrl: this.getBaseUrl(),
      path: options.path,
      params: options.params,
      query: options.query,
    });
    await this.stepNotifier.notify(
      `Make request ${id} ${options.method} ${url}`,
      options.body && {
        body: options.body,
      }
    );

    return new Promise<[unknown, http.IncomingMessage]>((resolve, reject) => {
      const makeRequest = getRequest(url);
      const serializedBody = options.body ? JSON.stringify(options.body) : null;
      const headers: any = {};
      if (serializedBody) {
        headers['Content-Type'] = 'application/json';
        headers['Content-Length'] = serializedBody.length;
      }
      let timeoutId: any = null;
      const parsed = new Url.URL(url);
      const req = makeRequest(
        {
          host: parsed.host,
          port: parsed.port,
          path: parsed.pathname,
          search: parsed.search,
          method: options.method,
          headers,
        },
        res => {
          let body = '';
          res.on('data', chunk => {
            body += chunk;
            if (body.length > maxBodyLength) {
              clearTimeout(timeoutId);
              reject(new TestError('Max response size exceeded: 1MB'));
              req.abort();
            }
          });
          res.on('end', () => {
            clearTimeout(timeoutId);
            resolve([tryParse(body), res]);
          });
        }
      );
      if (serializedBody) {
        req.write(serializedBody);
      }
      req.on('error', reject);
      req.end();

      timeoutId = setTimeout(() => {
        reject(new TestError(`Timeout exceeded: ${defaultTimeout}ms`));
        try {
          req.abort();
        } catch (ignore) {}
      }, defaultTimeout);
    }).then(async ret => {
      await this.stepNotifier.notify(`Response from request ${id}`, {
        status: ret[1].statusCode,
        body: ret[0],
      });
      return ret;
    });
  }

  async expectStatus(res: http.IncomingMessage, status: 200) {
    await this.stepNotifier.notify(`Expect status to equal "${status}"`);
    if (res.statusCode !== status) {
      throw new TestError(
        `Expect status to equal "${status}". Actual: "${res.statusCode}".`
      );
    }
  }

  async expectEqual<T>(actual: T, expected: T, name: string) {
    const serialized = JSON.stringify(expected);
    await this.stepNotifier.notify(`Expect "${name}" to equal "${serialized}"`);
    if (!R.equals(actual, expected)) {
      throw new TestError(
        `Expect "${name}" to equal "${serialized}". Actual: "${JSON.stringify(
          actual
        )}".`
      );
    }
  }

  async expectSchema<T extends Schema>(
    data: unknown,
    schema: T,
    sourceName: string,
    schemaName: string
  ): Promise<Convert<T>> {
    await this.stepNotifier.notify(
      `Expect "${schemaName}" to match "${schemaName}" schema.`
    );

    const { value: newValue, errors } = getValidateResult(data, schema, [
      sourceName,
    ]);
    if (errors.length) {
      throw new TestError(formatErrors(errors));
    }
    return newValue;
  }

  async randomInt() {
    return crypto.randomBytes(4).readUInt32BE(0);
  }
}
