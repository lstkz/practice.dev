import { RouteConfig } from 'src/types';

// --- Routing ---

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: 'any',
  path: '/privacy',
  component: () => import('./components/PrivacyView').then(x => x.PrivacyView),
};
