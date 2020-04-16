import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { ResetPasswordSymbol } from './symbol';

// --- Actions ---
export const [
  handle,
  ResetPasswordActions,
  getResetPasswordState,
] = createModule(ResetPasswordSymbol)
  .withActions({
    reset: null,
    showModal: null,
    hideModal: null,
    setDone: null,
    setSubmitting: (isSubmitting: boolean) => ({ payload: { isSubmitting } }),
    setError: (error: string | null) => ({ payload: { error } }),
  })
  .withState<ResetPasswordState>();

// --- Routing ---

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: false,
  path: '/reset-password',
  component: () =>
    import(
      /* webpackChunkName: 'reset-password' */ './components/ResetPasswordView'
    ).then(x => x.ResetPasswordView),
};

// --- Types ---
export interface ResetPasswordState {
  isModalOpen: boolean;
  isSubmitting: boolean;
  isDone: boolean;
  error: string | null;
}
