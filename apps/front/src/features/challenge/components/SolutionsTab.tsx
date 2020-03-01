import { createModule, useActions } from 'typeless';
import { Solution } from 'shared';
import { SolutionsTabSymbol } from '../symbol';
import { SelectOption, SearchResult } from 'src/types';
import React from 'react';
import * as Rx from 'src/rx';
import { TabContent } from './TabContent';
import { FilterSection } from 'src/components/FilterSection';
import { AsyncSelect, Select } from 'src/components/Select';
import { AsyncResult } from 'react-select-async-paginate';
import { getChallengeState } from '../interface';
import { searchChallengeTags, handleAppError } from 'src/common/helper';
import { api } from 'src/services/api';
import styled from 'styled-components';
import { VoidLink } from 'src/components/VoidLink';
import { SolutionDetails } from 'src/components/SolutionDetails';
import { useUser } from 'src/hooks/useUser';
import { SolutionActions } from 'src/features/solution/interface';
import { GlobalSolutionsActions } from 'src/features/globalSolutions/interface';
import { useSolutions } from 'src/features/globalSolutions/useSolutions';

export const [handle, SolutionsTabActions, getSolutionsTabState] = createModule(
  SolutionsTabSymbol
)
  .withActions({
    $init: null,
    updateFilter: (name: keyof SolutionsTabFilter, value: any) => ({
      payload: { name, value },
    }),
    searchTags: (
      keyword: string,
      cursor: string | null,
      resolve: (
        result: AsyncResult<{
          label: string;
          value: string;
        }>
      ) => void
    ) => ({
      payload: {
        keyword,
        cursor,
        resolve,
      },
    }),
    load: (loadMore: boolean) => ({ payload: { loadMore } }),
    loaded: (result: SearchResult<Solution>) => ({ payload: { result } }),
    setIsLoading: (isLoading: boolean) => ({ payload: { isLoading } }),
  })
  .withState<SolutionsTabState>();

handle
  .epic()
  .on(SolutionsTabActions.searchTags, ({ keyword, resolve, cursor }) => {
    return searchChallengeTags(
      getChallengeState().challenge.id,
      keyword,
      cursor,
      resolve
    );
  })
  .on(SolutionsTabActions.updateFilter, () => SolutionsTabActions.load(false))
  .on(SolutionsTabActions.load, ({ loadMore }, { action$ }) => {
    const { filter, cursor } = getSolutionsTabState();
    const sortCriteria =
      filter.sortOrder.value === 'newest'
        ? {
            sortBy: 'date' as const,
            sortDesc: true,
          }
        : filter.sortOrder.value === 'oldest'
        ? {
            sortBy: 'date' as const,
            sortDesc: false,
          }
        : {
            sortBy: 'likes' as const,
            sortDesc: true,
          };

    const search = () =>
      api
        .solution_searchSolutions({
          challengeId: getChallengeState().challenge.id,
          tags: filter.tags.map(x => x.value),
          cursor: loadMore ? cursor : null,
          ...sortCriteria,
        })
        .pipe(
          Rx.map(ret => SolutionsTabActions.loaded(ret)),
          handleAppError(),
          Rx.takeUntil(action$.pipe(Rx.waitForType(SolutionsTabActions.load)))
        );

    return loadMore
      ? Rx.concatObs(
          Rx.of(SolutionsTabActions.setIsLoading(true)),
          search(),
          Rx.of(SolutionsTabActions.setIsLoading(false))
        )
      : search();
  })
  .on(SolutionsTabActions.loaded, ({ result }) =>
    GlobalSolutionsActions.addSolutions(result.items)
  );

export interface SolutionsTabFilter {
  tags: SelectOption[];
  author: SelectOption[];
  sortOrder: SelectOption<'likes' | 'newest' | 'oldest'>;
}

export interface SolutionsTabState {
  isLoaded: boolean;
  items: string[];
  cursor: string | null;
  filter: SolutionsTabFilter;
  isLoading: boolean;
}

const defaultState: SolutionsTabState = {
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

handle
  .reducer(defaultState)
  .on(SolutionsTabActions.$init, state => {
    Object.assign(state, defaultState);
  })
  .on(SolutionsTabActions.updateFilter, (state, { name, value }) => {
    state.filter[name] = value;
  })
  .on(SolutionsTabActions.loaded, (state, { result }) => {
    state.isLoaded = true;
    state.cursor = result.cursor;
    state.items = result.items.map(x => x.id);
  });

const NoData = styled.div`
  text-align: center;
  margin-top: 40px;
`;

export function SolutionList() {
  const { isLoaded, cursor, items } = getSolutionsTabState.useState();
  const user = useUser();
  const { show, remove } = useActions(SolutionActions);
  const { voteSolution } = useActions(GlobalSolutionsActions);
  const solutions = useSolutions(items);
  if (!isLoaded) {
    return <>......</>;
  }
  if (!items.length) {
    return <NoData>No Solutions</NoData>;
  }
  return (
    <div>
      {solutions.map(solution => (
        <SolutionDetails
          link
          borderBottom
          canEdit={user && solution.user.id === user.id}
          solution={solution}
          key={solution.id}
          onMenu={action => {
            if (action === 'edit') {
              show('edit', solution);
            }
            if (action === 'delete') {
              remove();
            }
          }}
          voteSolution={voteSolution}
        />
      ))}
      {cursor && <VoidLink>Load More</VoidLink>}
    </div>
  );
}

export function SolutionFilter() {
  const { searchTags, updateFilter, load } = useActions(SolutionsTabActions);
  const { filter, isLoaded } = getSolutionsTabState.useState();
  React.useEffect(() => {
    if (!isLoaded) {
      load(false);
    }
  }, [isLoaded]);
  return (
    <div>
      <FilterSection label="Tags">
        <AsyncSelect
          id="tags"
          name="tags"
          isMulti
          defaultOptions
          value={filter.tags}
          loadOptions={(inputValue, _, additional) => {
            return new Promise(resolve => {
              searchTags(inputValue, additional, resolve);
            });
          }}
          onChange={options => {
            updateFilter(
              'tags',
              ((options as SelectOption[]) || []).map(x => ({
                label: x.value,
                value: x.value,
              }))
            );
          }}
        />
      </FilterSection>
      <FilterSection label="Sort by">
        <Select
          id="sortBy"
          name="sortBy"
          value={filter.sortOrder}
          options={[
            { label: 'Most likes', value: 'likes' },
            { label: 'Oldest', value: 'oldest' },
            { label: 'Newest', value: 'newest' },
          ]}
          onChange={option => updateFilter('sortOrder', option)}
        />
      </FilterSection>
    </div>
  );
}

export function SolutionsTab() {
  return <TabContent left={<SolutionList />} right={<SolutionFilter />} />;
}

export const useSolutionsModule = () => {
  handle();
};
