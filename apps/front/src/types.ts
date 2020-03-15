import { AC } from 'typeless';

export * from 'shared/src/types';

export interface RouteConfig {
  type: 'route';
  path: string | string[];
  exact?: boolean;
  auth: boolean | 'any';
  component: () => Promise<() => JSX.Element>;
  noLoader?: boolean;
  waitForAction?: AC;
}

export interface SelectOption<T = any> {
  label: string;
  value: T;
}

export type DeleteType = 'delete' | 'close';
