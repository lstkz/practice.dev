import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { ChallengeSymbol } from './symbol';
import { Challenge } from 'shared';

// --- Actions ---
export const [handle, ChallengeActions, getChallengeState] = createModule(
  ChallengeSymbol
)
  .withActions({
    $init: null,
    $mounted: null,
    $unmounted: null,
    loaded: (challenge: Challenge, component: React.SFC) => ({
      payload: { challenge, component },
    }),
    challengeLoaded: (challenge: Challenge) => ({ payload: { challenge } }),
  })
  .withState<ChallengeState>();

// --- Routing ---

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: 'any',
  path: '/challenges/:id',
  waitForAction: ChallengeActions.loaded,
  component: () =>
    import('./components/ChallengeView').then(x => x.ChallengeView),
};

// --- Types ---
export interface ChallengeState {
  isLoading: boolean;
  challenge: Challenge;
  component: React.SFC;
}
