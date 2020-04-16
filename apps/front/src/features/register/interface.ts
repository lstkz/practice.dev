import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { RegisterSymbol } from './symbol';

// --- Actions ---
export const [handle, RegisterActions, getRegisterState] = createModule(
  RegisterSymbol
)
  .withActions({
    showModal: null,
    hideModal: null,
    reset: null,
    setSubmitting: (isSubmitting: boolean) => ({ payload: { isSubmitting } }),
    setError: (error: string | null) => ({ payload: { error } }),
  })
  .withState<RegisterState>();

// --- Routing ---

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: false,
  path: '/register',
  component: () =>
    import(/* webpackChunkName: 'register' */ './components/RegisterView').then(
      x => x.RegisterView
    ),
};

// --- Types ---
export interface RegisterState {
  isModalOpen: boolean;
  isSubmitting: boolean;
  error: string | null;
}
