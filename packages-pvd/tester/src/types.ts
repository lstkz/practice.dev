import { SocketMessage } from 'shared';
import { Tester } from './Tester';

export interface TestOptions {
  url: string;
}

export type TestHandler = (options: { tester: Tester; url: string }) => any;

export interface TestConfiguration {
  handler: TestHandler;
}

export interface Notifier {
  notify(action: SocketMessage): Promise<void>;
  flush(): Promise<void>;
}

export interface StepNotifier {
  notify(text: string, data?: any): Promise<void>;
}

export type TestResult = 'pass' | 'fail' | 'pending';

export interface Test {
  id: number;
  name: string;
  result: TestResult;
  exec: () => Promise<void>;
}