import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { ConfirmChangeEmailSymbol } from './symbol';

// --- Actions ---
export const [
  handle,
  ConfirmChangeEmailActions,
  getConfirmChangeEmailState,
] = createModule(ConfirmChangeEmailSymbol).withActions({
  $mounted: null,
});

// --- Routing ---

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: 'any',
  path: '/confirm-email/:code',
  component: () =>
    import('./components/ConfirmChangeEmailView').then(
      x => x.ConfirmChangeEmailView
    ),
};
