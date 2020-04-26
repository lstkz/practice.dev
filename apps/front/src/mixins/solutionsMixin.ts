import * as Rx from 'src/rx';
import { SelectOption, LoadMoreResult, Solution } from 'src/types';
import { AsyncResult } from 'react-select-async-paginate';
import { HandleWithState } from 'typeless';
import { GlobalSolutionsActions } from 'src/features/globalSolutions/interface';
import { SolutionActions } from 'src/features/solution/interface';
import { getSolutionsSortCriteria, handleAppError } from 'src/common/helper';
import { confirmDeleteSolution } from 'src/common/solution';

export const BaseSolutionsActions = {
  $init: () => ({}),
  showByTag: (tag: string) => ({ payload: { tag } }),
  updateFilter: (
    name: keyof SolutionsFilter,
    value: any,
    noSearch = false
  ) => ({
    payload: { name, value, noSearch },
  }),
  searchTags: (
    keyword: string,
    cursor: string | null,
    resolve: ResolveTags
  ) => ({
    payload: {
      keyword,
      cursor,
      resolve,
    },
  }),
  load: (loadMore: boolean) => ({ payload: { loadMore } }),
  loaded: (loadMore: boolean, result: LoadMoreResult<Solution>) => ({
    payload: { loadMore, result },
  }),
  setIsLoading: (isLoading: boolean) => ({ payload: { isLoading } }),
  remove: (id: string) => ({ payload: { id } }),
};

export interface SolutionsFilter {
  tags: SelectOption[];
  author: SelectOption[];
  sortOrder: SelectOption<'likes' | 'newest' | 'oldest'>;
}

export interface SolutionsState {
  isLoaded: boolean;
  items: string[];
  cursor: string | null;
  filter: SolutionsFilter;
  isLoading: boolean;
}

export const defaultState: SolutionsState = {
  isLoaded: false,
  isLoading: false,
  items: [],
  cursor: null,
  filter: {
    tags: [],
    author: [],
    sortOrder: {
      label: 'Most Likes',
      value: 'likes',
    },
  },
};

export type ResolveTags = (
  result: AsyncResult<{
    label: string;
    value: string;
  }>
) => void;

export interface SolutionsMixinOptions {
  getState(): SolutionsState;
  handle: HandleWithState<SolutionsState>;
  Actions: typeof BaseSolutionsActions;
  searchTags?(
    keyword: string,
    cursor: string | null,
    resolve: ResolveTags
  ): Rx.Observable<never>;
  searchSolutions(criteria: {
    tags?: string[] | undefined;
    sortBy: 'date' | 'likes';
    sortDesc: boolean;
    limit?: number | undefined;
    cursor?: string | null | undefined;
  }): Rx.Observable<LoadMoreResult<Solution>>;
}

export function solutionsMixin(options: SolutionsMixinOptions) {
  const { handle, Actions, getState, searchTags, searchSolutions } = options;

  const epic = handle
    .epic()
    .on(SolutionActions.created, () => {
      if (!getState().isLoaded) {
        return Rx.empty();
      }
      return Actions.load(false);
    })
    .on(Actions.searchTags, ({ keyword, resolve, cursor }) => {
      if (!searchTags) {
        throw new Error('searchTags not set');
      }
      return searchTags(keyword, cursor, resolve);
    })
    .on(Actions.updateFilter, ({ noSearch }) => {
      return noSearch ? Rx.empty() : Actions.load(false);
    })
    .on(Actions.load, ({ loadMore }, { action$ }) => {
      const { filter, cursor } = getState();

      const search = () =>
        searchSolutions({
          tags: filter.tags.map(x => x.value),
          cursor: loadMore ? cursor : null,
          ...getSolutionsSortCriteria(filter.sortOrder.value),
        }).pipe(
          Rx.map(ret => Actions.loaded(loadMore, ret)),
          handleAppError(),
          Rx.takeUntil(action$.pipe(Rx.waitForType(Actions.load)))
        );

      return loadMore
        ? Rx.concatObs(
            Rx.of(Actions.setIsLoading(true)),
            search(),
            Rx.of(Actions.setIsLoading(false))
          )
        : search();
    })
    .on(Actions.loaded, ({ result }) =>
      GlobalSolutionsActions.addSolutions(result.items)
    )
    .on(Actions.remove, ({ id }, { action$ }) => {
      return confirmDeleteSolution({
        solutionId: id,
        action$,
      });
    })
    .on(Actions.showByTag, ({ tag }) => {
      return Actions.updateFilter(
        'tags',
        [{ label: tag, value: tag }],
        !getState().isLoaded
      );
    });

  const reducer = handle
    .reducer(defaultState)
    .on(Actions.$init, state => {
      Object.assign(state, defaultState);
    })
    .on(Actions.updateFilter, (state, { name, value }) => {
      state.filter[name] = value;
    })
    .on(Actions.setIsLoading, (state, { isLoading }) => {
      state.isLoading = isLoading;
    })
    .on(Actions.loaded, (state, { result, loadMore }) => {
      state.isLoaded = true;
      state.cursor = result.cursor;
      const ids = result.items.map(x => x.id);
      if (loadMore) {
        state.items.push(...ids);
      } else {
        state.items = ids;
      }
    })
    .on(GlobalSolutionsActions.removeSolution, (state, { id }) => {
      state.items = state.items.filter(x => x !== id);
    });

  return { epic, reducer };
}
