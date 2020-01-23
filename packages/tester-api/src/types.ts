import { SocketMessage } from 'shared';
import { Tester } from './Tester';

export interface TestOptions {
  url: string;
}

export type TestHandler = (options: { tester: Tester; url: string }) => any;

export interface ApiTestConfiguration {
  handler: TestHandler;
}

export interface Notifier {
  notify(action: SocketMessage): Promise<void>;
  flush(): Promise<void>;
}
