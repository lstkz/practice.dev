import { createModule, useActions } from 'typeless';
import { SolutionsTabSymbol } from '../symbol';
import { SelectOption } from 'src/types';
import React from 'react';
import { TabContent } from './TabContent';
import { FilterSection } from 'src/components/FilterSection';
import { AsyncSelect, Select } from 'src/components/Select';
import { getChallengeState } from '../interface';
import { api } from 'src/services/api';
import {
  BaseSolutionsActions,
  solutionsMixin,
  SolutionsState,
} from 'src/mixins/solutionsMixin';
import { searchSolutionTags } from 'src/common/helper';
import { SolutionList } from 'src/components/SolutionList';

export const [handle, SolutionsTabActions, getSolutionsTabState] = createModule(
  SolutionsTabSymbol
)
  .withActions({
    ...BaseSolutionsActions,
  })
  .withState<SolutionsState>();

solutionsMixin({
  handle,
  Actions: SolutionsTabActions,
  getState: getSolutionsTabState,
  searchSolutions: criteria =>
    api.solution_searchSolutions({
      ...criteria,
      challengeId: getChallengeState().challenge.id,
    }),
  searchTags: (keyword, cursor, resolve) =>
    searchSolutionTags(
      getChallengeState().challenge.id,
      keyword,
      cursor,
      resolve
    ),
});

export function SolutionFilter() {
  const { searchTags, updateFilter } = useActions(SolutionsTabActions);
  const { filter } = getSolutionsTabState.useState();
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
  const { load, remove, updateFilter } = useActions(SolutionsTabActions);
  const {
    isLoaded,
    cursor,
    items,
    isLoading,
  } = getSolutionsTabState.useState();
  return (
    <TabContent
      left={
        <SolutionList
          isLoaded={isLoaded}
          cursor={cursor}
          items={items}
          isLoading={isLoading}
          load={load}
          remove={remove}
          onTagClick={tag => {
            updateFilter('tags', [{ label: tag, value: tag }]);
          }}
        />
      }
      right={<SolutionFilter />}
    />
  );
}

export const useSolutionsModule = () => {
  handle();
};
