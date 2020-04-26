import { createModule, useActions } from 'typeless';
import { Solution } from 'shared';
import { SolutionsTabSymbol } from '../symbol';
import {
  BaseSolutionsActions,
  SolutionsState,
  solutionsMixin,
} from 'src/mixins/solutionsMixin';
import { api } from 'src/services/api';
import { getPublicProfileState } from '../interface';
import React from 'react';
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
      username: getPublicProfileState().profile.username,
    }),
});

export function SolutionsTab() {
  const { load, remove } = useActions(SolutionsTabActions);
  const {
    isLoaded,
    cursor,
    items,
    isLoading,
  } = getSolutionsTabState.useState();
  return (
    <SolutionList
      isLoaded={isLoaded}
      cursor={cursor}
      items={items}
      isLoading={isLoading}
      load={load}
      remove={remove}
    />
  );
}
export const useSolutionsModule = () => {
  handle();
};
