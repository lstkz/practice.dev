import { Page, Request } from 'puppeteer';
import type { APIClient } from 'shared';
import type { Observable } from 'rxjs';
import Url from 'url';

type GetParams<T> = T extends () => any
  ? null
  : T extends (a: infer A) => any
  ? A
  : T extends (a: infer A, b: infer B) => any
  ? [A, B]
  : T extends (a: infer A) => any
  ? A
  : never;

type GetResult<T> = T extends (...args: any[]) => Observable<infer K>
  ? K
  : never;

export class MockError extends Error {
  constructor(message: string, public status: number = 400) {
    super(message);
  }
}
export class NoConnectionError extends Error {
  constructor(message: string = 'No Connection') {
    super(message);
  }
}

function createResponse(body: any, status: number) {
  return {
    body: JSON.stringify(body),
    contentType: 'application/json',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    status,
  };
}

function tryParse(str: string) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}

export class Engine {
  private mocks: Record<string, (params: any, count: number) => any> = {};
  private rawMocks: Record<
    string,
    (request: Request, count: number) => any
  > = {};
  private requestCount: Record<string, number> = {};
  private onRequest: (request: Request) => Promise<void> = null!;

  constructor(private page: Page, private baseUrl: string) {}

  private token: string | null = null;
  private isTokenSet = true;
  private mockedBundle: string | null = null;

  setMockedBundle(mockedBundle: string | null) {
    this.mockedBundle = mockedBundle;
  }

  setToken(token: string | null) {
    this.token = token;
    this.isTokenSet = false;
  }

  private incCount(name: string) {
    if (!this.requestCount[name]) {
      this.requestCount[name] = 0;
    }
    this.requestCount[name]++;
    return this.requestCount[name];
  }

  async setup() {
    if (page.url() !== 'about:blank') {
      await page.goto('about:blank');
    }
    await this.page.removeAllListeners();
    await page.setRequestInterception(true);
    await (this.page as any)._client.send('Storage.clearDataForOrigin', {
      origin: this.baseUrl,
      storageTypes:
        'appcache,cache_storage,cookies,indexeddb,local_storage,service_workers,websql',
    });
    this.onRequest = async request => {
      const rawMockName = `${request.method()} ${
        Url.parse(request.url()).pathname
      }`;
      const rawMock = this.rawMocks[rawMockName];
      if (rawMock) {
        rawMock(request, this.incCount(rawMockName));
        return;
      }
      if (this.mockedBundle && request.url().endsWith('/bundle.js')) {
        request.respond({
          body: `
          ChallengeJSONP({
            Details: function () {
              return '${this.mockedBundle}'
            }
          })
          `,
          contentType: 'text/javascript',
        });
        return;
      }
      if (!this.isTokenSet && this.page.url() !== 'about:blank') {
        this.isTokenSet = true;
        await this.page.evaluate(token => {
          if (token) {
            localStorage.setItem('token', token);
          } else {
            localStorage.removeItem('token');
          }
        }, this.token);
      }
      const url = request.url();
      const exec = /rpc\/(.+)$/.exec(url);
      if (!exec) {
        await request.continue();
        return;
      }
      if (request.method() === 'OPTIONS') {
        await request.respond({
          contentType: 'text/plain',
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
          },
        });
        return;
      }
      const name = exec[1].replace('.', '_');
      if (!this.mocks[name]) {
        await request.respond(
          createResponse({ error: 'RPC method not mocked: ' + name }, 400)
        );
        return;
      }

      try {
        const mock = this.mocks[name];
        const body: any[] = tryParse(request.postData()) || [];
        const ret = mock(
          body.length === 0 ? null : body.length === 1 ? body[0] : body,
          this.incCount(name)
        );
        await request.respond(createResponse(ret, 200));
      } catch (e) {
        if (e instanceof MockError) {
          await request.respond(
            createResponse({ error: e.message }, e.status || 400)
          );
        } else if (e instanceof NoConnectionError) {
          await request.abort();
        } else {
          await request.respond(
            createResponse(
              { error: 'Internal error: ' + e.message },
              e.status || 500
            )
          );
          throw e;
        }
      }
    };

    page.on('request', this.onRequest);
  }

  mock<TName extends keyof APIClient>(
    name: TName,
    response: (
      params: GetParams<APIClient[TName]>,
      count: number
    ) => GetResult<APIClient[TName]>
  ) {
    this.mocks[name] = response;
  }

  rawMock(
    method: 'POST' | 'GET' | 'PUT',
    url: string,
    response: (request: Request, count: number) => void
  ) {
    this.rawMocks[`${method} ${url}`] = response;
  }
}
