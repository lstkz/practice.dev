import * as Rx from 'src/rx';
import {
  ChallengesActions,
  ChallengesState,
  handle,
  ChallengesFilter,
  SolveStatus,
  ChallengesSortOrder,
} from './interface';
import { api } from 'src/services/api';
import { handleAppError } from 'src/common/helper';
import { RouterActions, getRouterState, RouterLocation } from 'typeless-router';
import { createChallengesUrl, parseQueryString, isRoute } from 'src/common/url';
import { ChallengeDifficulty, ChallengeDomain } from 'shared';
import { SelectOption } from 'src/types';
import { GlobalActions } from '../global/interface';

export const statuses: SolveStatus[] = ['solved', 'unsolved'];
export const difficulties: ChallengeDifficulty[] = ['easy', 'medium', 'hard'];
export const domains: ChallengeDomain[] = ['frontend', 'backend', 'fullstack'];
export const sortOptions: SelectOption<ChallengesSortOrder>[] = [
  { label: 'Oldest', value: 'oldest' },
  { label: 'Newest', value: 'newest' },
  { label: 'Most submissions', value: 'submissions' },
  { label: 'Most solved', value: 'solved' },
];

function parseFilterValue(str: string, allowed?: string[]) {
  const value = (str || '').trim().toLowerCase();
  if (!allowed || allowed.includes(value)) {
    return value;
  } else {
    return null;
  }
}

function parseFilterValues(str: string, allowed?: string[]) {
  const values = (str || '')
    .split(',')
    .map(x => parseFilterValue(x, allowed))
    .filter(x => x) as string[];
  return values;
}
function parseFilterMap(str: string, allowed?: string[]) {
  const values = parseFilterValues(str, allowed);
  return values.reduce((ret, value) => {
    ret[value] = value;
    return ret;
  }, {} as any);
}

function getDefaultFilter(): ChallengesFilter {
  return {
    statuses: {},
    difficulties: {},
    domains: {},
    tags: [],
    sortOrder: sortOptions[0],
  };
}

export function getFilter(location: RouterLocation) {
  const params = parseQueryString(location.search);
  const filter = getDefaultFilter();
  filter.tags = parseFilterValues(params.tags).map(tag => ({
    label: tag,
    value: tag,
  }));
  filter.statuses = parseFilterMap(params.status, statuses);
  filter.difficulties = parseFilterMap(params.difficulty, difficulties);
  filter.domains = parseFilterMap(params.domain, domains);
  const sortOrder =
    (parseFilterValue(
      params.sortOrder,
      sortOptions.map(x => x.value)
    ) as ChallengesSortOrder) || sortOptions[0].value;

  filter.sortOrder = sortOptions.find(x => x.value === sortOrder)!;
  return filter;
}

// --- Epic ---
handle
  .epic()
  .on(GlobalActions.auth, () => ChallengesActions.load())
  .on(ChallengesActions.$mounted, () => ChallengesActions.load())
  .on(RouterActions.locationChange, () => {
    if (isRoute('challenges')) {
      return ChallengesActions.load();
    }
    return Rx.empty();
  })
  .on(ChallengesActions.updateFilter, ({ name, value }) => {
    const filter = getFilter(getRouterState().location!);
    filter[name] = value;
    return RouterActions.push(
      createChallengesUrl({
        statuses: Object.values(filter.statuses) as string[],
        difficulties: Object.values(filter.difficulties) as string[],
        domains: Object.values(filter.domains) as string[],
        tags: filter.tags.map(x => x.value),
        sortOrder: filter.sortOrder.value,
      })
    );
  })
  .on(ChallengesActions.load, () => {
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
      .challenge_searchChallenges({
        statuses: Object.values(filter.statuses) as any,
        difficulties: Object.values(filter.difficulties) as any,
        domains: Object.values(filter.domains) as any,
        tags: filter.tags.map(x => x.value),
        ...sortCriteria,
      })
      .pipe(
        Rx.map(ret => ChallengesActions.loaded(ret)),
        handleAppError()
      );
  })
  .on(ChallengesActions.loaded, () =>
    api.challenge_getChallengeTags().pipe(
      Rx.map(ret => ChallengesActions.tagsLoaded(ret)),
      Rx.catchLog(() => Rx.empty())
    )
  );

// --- Reducer ---

const initialState: ChallengesState = {
  isLoading: true,
  items: [],
  tags: null,
  total: 0,
  pageSize: 0,
  pageNumber: 0,
  totalPages: 0,
};

handle
  .reducer(initialState)
  .on(ChallengesActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(ChallengesActions.loaded, (state, { result }) => {
    state.isLoading = false;
    state.items = result.items;
    state.total = result.total;
    state.pageSize = result.pageSize;
    state.pageNumber = result.pageNumber;
    state.totalPages = result.totalPages;
  })
  .on(ChallengesActions.tagsLoaded, (state, { tags }) => {
    state.tags = tags;
  });

// --- Module ---
export function useChallengesModule() {
  handle();
}
