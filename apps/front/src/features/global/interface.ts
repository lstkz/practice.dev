import { RouteConfig, User, AuthData } from 'src/types';
import { createModule } from 'typeless';
import { GlobalSymbol } from './symbol';

// --- Actions ---
export const [handle, GlobalActions, getGlobalState] = createModule(
  GlobalSymbol
)
  .withActions({
    $mounted: null,
    logout: null,
    auth: (authData: AuthData) => ({ payload: authData }),
    loggedIn: (user: User | null) => ({
      payload: { user },
    }),
  })
  .withState<GlobalState>();

// --- Routing ---

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/global',
  component: () => import('./components/GlobalView').then(x => x.GlobalView),
};

// --- Types ---
export interface GlobalState {
  isLoaded: boolean;
  user: User | null;
}
