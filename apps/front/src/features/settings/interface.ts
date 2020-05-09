import { RouteConfig, PublicUserProfile } from 'src/types';
import { createModule } from 'typeless';
import { SettingsSymbol } from './symbol';

// --- Actions ---
export const [handle, SettingsActions, getSettingsState] = createModule(
  SettingsSymbol
)
  .withActions({
    $init: null,
    $mounted: null,
    changeTab: (tab: SettingsTab) => ({ payload: { tab } }),
    profileLoaded: (profile: PublicUserProfile) => ({
      payload: { profile },
    }),
  })
  .withState<SettingsState>();

// --- Routing ---

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/settings',
  component: () =>
    import('./components/SettingsView').then(x => x.SettingsView),
  waitForAction: SettingsActions.profileLoaded,
};

// --- Types ---
export interface SettingsState {
  isLoaded: boolean;
  profile: PublicUserProfile;
  tab: SettingsTab;
}

export type SettingsTab = 'profile' | 'account';
