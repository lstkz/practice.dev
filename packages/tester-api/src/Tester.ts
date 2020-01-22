const defaultTimeout = 2500;

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

export class Tester {
  tests: Test[] = [];
  baseUrl: string | null = null;

  constructor(private stepNotifier: StepNotifier) {}

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
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
    await this.stepNotifier.notify(
      `Make request ${options.method} ${options.path}`,
      {
        query: options.query,
        body: options.body,
        path: options.path,
      }
    );
  }
}
