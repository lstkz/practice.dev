import { createModule, useActions } from 'typeless';
import { LikesTabSymbol } from '../symbol';
import {
  BaseSolutionsActions,
  SolutionsState,
  solutionsMixin,
} from 'src/mixins/solutionsMixin';
import { api } from 'src/services/api';
import { getPublicProfileState } from '../interface';
import React from 'react';
import { SolutionList } from 'src/components/SolutionList';

export const [handle, LikesTabActions, getLikesTabState] = createModule(
  LikesTabSymbol
)
  .withActions({
    ...BaseSolutionsActions,
  })
  .withState<SolutionsState>();

solutionsMixin({
  handle,
  Actions: LikesTabActions,
  getState: getLikesTabState,
  searchSolutions: criteria =>
    api.solution_searchLikesSolutions({
      limit: criteria.limit,
      cursor: criteria.cursor,
      username: getPublicProfileState().profile.username,
    }),
});

export function LikesTab() {
  const { load, remove } = useActions(LikesTabActions);
  const { isLoaded, cursor, items, isLoading } = getLikesTabState.useState();
  return (
    <SolutionList
      noAutoLoad
      emptyText="No liked solutions"
      isLoaded={isLoaded}
      cursor={cursor}
      items={items}
      isLoading={isLoading}
      load={load}
      remove={remove}
    />
  );
}
export const useLikesModule = () => {
  handle();
};
