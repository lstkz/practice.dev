import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { ChangePasswordSymbol } from './symbol';

// --- Actions ---
export const [
  handle,
  ChangePasswordActions,
  getChangePasswordState,
] = createModule(ChangePasswordSymbol)
  .withActions({
    $init: null,
    setSubmitting: (isSubmitting: boolean) => ({ payload: { isSubmitting } }),
    setError: (error: string | null) => ({ payload: { error } }),
  })
  .withState<ChangePasswordState>();

// --- Routing ---

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: false,
  path: '/reset-password/:code',
  component: () =>
    import(
      /* webpackChunkName: 'change-password' */ './components/ChangePasswordView'
    ).then(x => x.ChangePasswordView),
};

// --- Types ---
export interface ChangePasswordState {
  isSubmitting: boolean;
  error: string | null;
}
