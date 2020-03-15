import { RouteConfig } from 'src/types';
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
      favoriteSolutions: string[],
      component: React.SFC
    ) => ({
      payload: { challenge, recentSubmissions, favoriteSolutions, component },
    }),
    challengeLoaded: (challenge: Challenge) => ({ payload: { challenge } }),
    changeTab: (tab: ChallengeTab) => ({ payload: { tab } }),
    addRecentSubmission: (submission: Submission) => ({
      payload: { submission },
    }),
    showSolutionsWithTag: (tag: string) => ({ payload: { tag } }),
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
  favoriteSolutions: string[];
}

export type ChallengeTab = 'details' | 'testSuite' | 'solutions' | 'discussion';
