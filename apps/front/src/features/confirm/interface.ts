import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { ConfirmSymbol } from './symbol';

// --- Actions ---
export const [handle, ConfirmActions, getConfirmState] = createModule(
  ConfirmSymbol
).withActions({
  $mounted: null,
});

// --- Routing ---

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: 'any',
  path: '/confirm/:code',
  component: () => import('./components/ConfirmView').then(x => x.ConfirmView),
};
