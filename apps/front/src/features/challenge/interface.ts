import { RouteConfig, Solution } from 'src/types';
import { createModule } from 'typeless';
import { ChallengeSymbol } from './symbol';
import { Challenge, TestInfo, Submission } from 'shared';

// --- Actions ---
export const [handle, ChallengeActions, getChallengeState] = createModule(
  ChallengeSymbol
)
  .withActions({
    $init: null,
    $mounted: null,
    $unmounted: null,
    loaded: (
      challenge: Challenge,
      recentSubmissions: Submission[],
      favoriteSolutions: Solution[],
      component: React.SFC
    ) => ({
      payload: { challenge, recentSubmissions, favoriteSolutions, component },
    }),
    challengeLoaded: (challenge: Challenge) => ({ payload: { challenge } }),
    changeTab: (tab: ChallengeTab) => ({ payload: { tab } }),
    addRecentSubmission: (submission: Submission) => ({
      payload: { submission },
    }),
    voteSolution: (id: string, like: boolean) => ({
      payload: { id, like },
    }),
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
  tab: ChallengeTab;
  testCase: TestInfo[];
  recentSubmissions: Submission[];
  favoriteSolutions: Solution[];
}

export type ChallengeTab = 'details' | 'testSuite' | 'solutions' | 'discussion';
