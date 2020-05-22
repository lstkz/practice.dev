import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { ProjectSymbol } from './symbol';
import { Project, ProjectChallenge } from 'shared';

// --- Actions ---
export const [handle, ProjectActions, getProjectState] = createModule(
  ProjectSymbol
)
  .withActions({
    $init: null,
    $mounted: null,
    load: null,
    loaded: (project: Project, challenges: ProjectChallenge[]) => ({
      payload: { project, challenges },
    }),
  })
  .withState<ProjectState>();

// --- Routing ---

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: 'any',
  path: '/projects/:id',
  waitForAction: ProjectActions.loaded,
  component: () => import('./components/ProjectView').then(x => x.ProjectView),
};

// --- Types ---
export interface ProjectState {
  isLoading: boolean;
  project: Project;
  challenges: ProjectChallenge[];
}
