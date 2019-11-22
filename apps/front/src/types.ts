export * from 'shared/src/types';

export interface RouteConfig {
  type: 'route';
  path: string | string[];
  exact?: boolean;
  auth: boolean;
  component: () => Promise<() => JSX.Element>;
  noLoader?: boolean;
}
