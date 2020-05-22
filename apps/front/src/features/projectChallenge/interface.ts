import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { ProjectChallengeSymbol } from './symbol';
import { ProjectChallenge, TestInfo } from 'shared';

// --- Actions ---
export const [
  handle,
  ProjectChallengeActions,
  getProjectChallengeState,
] = createModule(ProjectChallengeSymbol)
  .withActions({
    $init: null,
    $mounted: null,
    $unmounted: null,
    load: null,
    loaded: (challenge: ProjectChallenge, component: React.SFC) => ({
      payload: { challenge, component },
    }),
    changeTab: (tab: ProjectChallengeTab) => ({ payload: { tab } }),
  })
  .withState<ProjectChallengeState>();

// --- Routing ---

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: 'any',
  path: '/projects/:projectId/challenges/:id',
  waitForAction: ProjectChallengeActions.loaded,
  component: () =>
    import('./components/ProjectChallengeView').then(
      x => x.ProjectChallengeView
    ),
};

// --- Types ---
export interface ProjectChallengeState {
  isLoading: boolean;
  challenge: ProjectChallenge;
  component: React.SFC;
  tab: ProjectChallengeTab;
  testCase: TestInfo[];
}

export type ProjectChallengeTab = 'details' | 'testSuite' | 'discussion';
