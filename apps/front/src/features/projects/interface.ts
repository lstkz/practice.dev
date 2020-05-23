import { RouteConfig, ChallengeDomain, SelectOption } from 'src/types';
import { createModule } from 'typeless';
import { ProjectsSymbol } from './symbol';
import { Project, PagedResult } from 'shared';

// --- Actions ---
export const [handle, ProjectsActions, getProjectsState] = createModule(
  ProjectsSymbol
)
  .withActions({
    $init: null,
    $mounted: null,
    $unmounted: null,
    load: null,
    loaded: (result: PagedResult<Project>) => ({ payload: { result } }),
    updateFilter: (name: keyof ProjectsFilter, value: any) => ({
      payload: { name, value },
    }),
  })
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
  waitForAction: ProjectsActions.loaded,
};

// --- Types ---

export interface ProjectsFilter {
  statuses: {
    [x in SolveStatus]?: SolveStatus;
  };
  domains: {
    [x in ChallengeDomain]?: ChallengeDomain;
  };
  sortOrder: SelectOption<ProjectsSortOrder>;
}

export interface ProjectsState {
  isLoading: boolean;
  total: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
  items: Project[];
}

export type ProjectsSortOrder = 'submissions' | 'oldest' | 'newest' | 'solved';

export type SolveStatus = 'solved' | 'partial' | 'unsolved';
