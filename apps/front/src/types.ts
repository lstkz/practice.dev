export interface RouteConfig {
  type: 'route';
  path: string | string[];
  exact?: boolean;
  auth: boolean;
  component: () => Promise<() => JSX.Element>;
  noLoader?: boolean;
}

export interface User {
  id: number;
}
