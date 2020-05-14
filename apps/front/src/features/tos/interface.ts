import { RouteConfig } from 'src/types';

// --- Routing ---

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: 'any',
  path: '/terms',
  component: () => import('./components/TosView').then(x => x.TosView),
};
