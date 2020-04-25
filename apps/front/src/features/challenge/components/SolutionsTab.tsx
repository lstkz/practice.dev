import { createModule, useActions } from 'typeless';
import { SolutionsTabSymbol } from '../symbol';
import { SelectOption } from 'src/types';
import React from 'react';
import { TabContent } from './TabContent';
import { FilterSection } from 'src/components/FilterSection';
import { AsyncSelect, Select } from 'src/components/Select';
import { getChallengeState } from '../interface';
import { api } from 'src/services/api';
import styled from 'styled-components';
import { VoidLink } from 'src/components/VoidLink';
import { SolutionDetails } from 'src/components/SolutionDetails';
import { useUser } from 'src/hooks/useUser';
import { SolutionActions } from 'src/features/solution/interface';
import { GlobalSolutionsActions } from 'src/features/globalSolutions/interface';
import { useSolutions } from 'src/features/globalSolutions/useSolutions';
import { SolutionLoader } from '../../../components/SolutionLoader';
import {
  BaseSolutionsActions,
  solutionsMixin,
  SolutionsState,
} from 'src/mixins/solutionsMixin';
import { searchSolutionTags } from 'src/common/helper';

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

const NoData = styled.div`
  text-align: center;
  margin-top: 40px;
`;

const LoadMore = styled.div`
  margin-top: 20px;
  text-align: center;
`;

export function SolutionList() {
  const { load, remove, updateFilter } = useActions(SolutionsTabActions);
  const {
    isLoaded,
    cursor,
    items,
    isLoading,
  } = getSolutionsTabState.useState();
  const user = useUser();
  const { show } = useActions(SolutionActions);
  const { voteSolution } = useActions(GlobalSolutionsActions);
  const solutions = useSolutions(items);
  if (!isLoaded) {
    return (
      <>
        <SolutionLoader />
        <SolutionLoader />
        <SolutionLoader />
      </>
    );
  }
  if (!items.length) {
    return <NoData data-test="no-solutions">No Solutions</NoData>;
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
              remove(solution.id);
            }
          }}
          voteSolution={voteSolution}
          onTagClick={tag => {
            updateFilter('tags', [{ label: tag, value: tag }]);
          }}
        />
      ))}
      {cursor && (
        <LoadMore>
          {isLoading ? (
            <VoidLink>Loading...</VoidLink>
          ) : (
            <VoidLink data-test="load-more-btn" onClick={() => load(true)}>
              Load More
            </VoidLink>
          )}
        </LoadMore>
      )}
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
