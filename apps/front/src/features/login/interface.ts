import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { LoginSymbol } from './symbol';

// --- Actions ---
export const [handle, LoginActions, getLoginState] = createModule(LoginSymbol)
  .withActions({
    $init: null,
    setSubmitting: (isSubmitting: boolean) => ({ payload: { isSubmitting } }),
    setError: (error: string | null) => ({ payload: { error } }),
  })
  .withState<LoginState>();

// --- Routing ---

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: false,
  path: '/login',
  component: () =>
    import(/* webpackChunkName: 'login' */ './components/LoginView').then(
      x => x.LoginView
    ),
};

// --- Types ---
export interface LoginState {
  isSubmitting: boolean;
  error: string | null;
}
