import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { PublicProfileSymbol } from './symbol';
import { PublicUserProfile } from 'shared';

// --- Actions ---
export const [
  handle,
  PublicProfileActions,
  getPublicProfileState,
] = createModule(PublicProfileSymbol)
  .withActions({
    $init: null,
    $mounted: null,
    profileLoaded: (profile: PublicUserProfile) => ({
      payload: { profile },
    }),
    changeTab: (tab: ProfileTab) => ({ payload: { tab } }),
  })
  .withState<PublicProfileState>();

// --- Routing ---

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: 'any',
  path: '/profile/:username',
  component: () =>
    import('./components/PublicProfileView').then(x => x.PublicProfileView),
  waitForAction: PublicProfileActions.profileLoaded,
};

// --- Types ---
export interface PublicProfileState {
  profile: PublicUserProfile;
  isLoaded: boolean;
  tab: ProfileTab;
}

export type ProfileTab =
  | 'overview'
  | 'solutions'
  | 'likes'
  | 'followers'
  | 'following';
