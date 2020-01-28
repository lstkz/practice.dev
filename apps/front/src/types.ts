import { ActionLike, AC } from 'typeless';

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
