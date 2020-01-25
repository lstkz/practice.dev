import { User, AuthData } from 'src/types';
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

// --- Types ---
export interface GlobalState {
  isLoaded: boolean;
  user: User | null;
}
