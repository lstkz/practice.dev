import { Page } from 'puppeteer';
import { SocketMessage } from 'shared';
import { Tester } from './Tester';

export interface TestOptions {
  url: string;
}

export type TestHandler = (options: {
  tester: Tester;
  url: string;
  createPage: () => Promise<Page>;
}) => any;

export interface TestConfiguration {
  page: 'single' | 'multi';
  handler: TestHandler;
}

export interface Notifier {
  notify(action: SocketMessage): Promise<void>;
  flush(): Promise<void>;
}
