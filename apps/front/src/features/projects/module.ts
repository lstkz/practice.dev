import * as Rx from 'src/rx';
import {
  ProjectsState,
  handle,
  SolveStatus,
  ProjectsSortOrder,
  ProjectsActions,
  ProjectsFilter,
} from './interface';
import { api } from 'src/services/api';
import {
  handleAppError,
  parseFilterMap,
  parseFilterValue,
} from 'src/common/helper';
import { ChallengeDomain } from 'shared';
import { RouterActions, getRouterState, RouterLocation } from 'typeless-router';
import { parseQueryString, isRoute, createProjectsUrl } from 'src/common/url';
import { SelectOption } from 'src/types';
import { GlobalActions } from '../global/interface';

export const statuses: SolveStatus[] = ['solved', 'partial', 'unsolved'];
export const domains: ChallengeDomain[] = ['frontend', 'backend', 'fullstack'];
export const sortOptions: SelectOption<ProjectsSortOrder>[] = [
  { label: 'Oldest', value: 'oldest' },
  { label: 'Newest', value: 'newest' },
  { label: 'Most submissions', value: 'submissions' },
  { label: 'Most solved', value: 'solved' },
];

function getDefaultFilter(): ProjectsFilter {
  return {
    statuses: {},
    domains: {},
    sortOrder: sortOptions[0],
  };
}

export function getFilter(location: RouterLocation) {
  const params = parseQueryString(location.search);
  const filter = getDefaultFilter();
  filter.statuses = parseFilterMap(params.status, statuses);
  filter.domains = parseFilterMap(params.domain, domains);
  const sortOrder =
    (parseFilterValue(
      params.sortOrder,
      sortOptions.map(x => x.value)
    ) as ProjectsSortOrder) || sortOptions[0].value;

  filter.sortOrder = sortOptions.find(x => x.value === sortOrder)!;
  return filter;
}

// --- Epic ---
handle
  .epic()
  .on(GlobalActions.auth, () => ProjectsActions.load())
  .on(ProjectsActions.$mounted, () => ProjectsActions.load())
  .on(RouterActions.locationChange, () => {
    if (isRoute('projects')) {
      return ProjectsActions.load();
    }
    return Rx.empty();
  })
  .on(ProjectsActions.updateFilter, ({ name, value }) => {
    const filter = getFilter(getRouterState().location!);
    filter[name] = value;
    return RouterActions.push(
      createProjectsUrl({
        statuses: Object.values(filter.statuses) as string[],
        domains: Object.values(filter.domains) as string[],
        sortOrder: filter.sortOrder.value,
      })
    );
  })
  .on(ProjectsActions.load, () => {
    const filter = getFilter(getRouterState().location!);
    const sortCriteria =
      filter.sortOrder.value === 'newest'
        ? {
            sortBy: 'created' as const,
            sortOrder: 'desc' as const,
          }
        : filter.sortOrder.value === 'oldest'
        ? {
            sortBy: 'created' as const,
            sortOrder: 'asc' as const,
          }
        : filter.sortOrder.value === 'solved'
        ? {
            sortBy: 'solved' as const,
            sortOrder: 'desc' as const,
          }
        : {
            sortBy: 'submissions' as const,
            sortOrder: 'desc' as const,
          };
    return api
      .project_searchProjects({
        statuses: Object.values(filter.statuses) as any,
        domains: Object.values(filter.domains) as any,
        ...sortCriteria,
      })
      .pipe(
        Rx.map(ret => ProjectsActions.loaded(ret)),
        handleAppError()
      );
  });

// --- Reducer ---
const initialState: ProjectsState = {
  isLoading: true,
  items: [],
  total: 0,
  pageSize: 0,
  pageNumber: 0,
  totalPages: 0,
};

handle
  .reducer(initialState)
  .on(ProjectsActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(ProjectsActions.loaded, (state, { result }) => {
    state.isLoading = false;
    state.items = result.items;
    state.total = result.total;
    state.pageSize = result.pageSize;
    state.pageNumber = result.pageNumber;
    state.totalPages = result.totalPages;
  });

// --- Module ---
export function useProjectsModule() {
  handle();
}
