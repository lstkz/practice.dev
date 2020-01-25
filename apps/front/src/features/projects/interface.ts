import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { ProjectsSymbol } from './symbol';

// --- Actions ---
export const [handle, ProjectsActions, getProjectsState] = createModule(
  ProjectsSymbol
)
  .withActions({})
  .withState<ProjectsState>();

// --- Routing ---

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: 'any' as const,
  path: '/projects',
  component: () =>
    import(/* webpackChunkName: 'projects' */ './components/ProjectsView').then(
      x => x.ProjectsView
    ),
};

// --- Types ---
export interface ProjectsState {
  foo: string;
}
