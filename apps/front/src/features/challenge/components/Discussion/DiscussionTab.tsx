import { Loader } from 'src/components/Loader';
import * as Rx from 'src/rx';
import { createModule, useActions } from 'typeless';
import React from 'react';
import { DiscussionSymbol } from '../../symbol';
import styled from 'styled-components';
import { AddComment } from './AddComment';
import { api } from 'src/services/api';
import { getChallengeState } from '../../interface';
import { handleAppError } from 'src/common/helper';
import { LoadMoreResult, DiscussionComment } from 'shared';
import { SelectOption } from 'src/types';
import { SortOptions } from './SortOptions';
import { Theme } from 'ui';
import { CommentItem } from './CommentItem';

export const [handle, DiscussionActions, getDiscussionState] = createModule(
  DiscussionSymbol
)
  .withActions({
    $init: null,
    load: (loadMore: boolean) => ({ payload: { loadMore } }),
    loaded: (loadMore: boolean, result: LoadMoreResult<DiscussionComment>) => ({
      payload: { loadMore, result },
    }),
    setIsLoading: (isLoading: boolean) => ({ payload: { isLoading } }),
    setIsSubmitting: (isSubmitting: boolean) => ({ payload: { isSubmitting } }),
    commentCreated: (comment: DiscussionComment) => ({ payload: { comment } }),
    updateSort: (sortBy: SelectOption<DiscussionSortBy>) => ({
      payload: { sortBy },
    }),
  })
  .withState<ApiSpecState>();

interface ApiSpecState {
  isLoaded: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  items: DiscussionComment[];
  cursor: string | null;
  sortBy: SelectOption<DiscussionSortBy>;
}

export type DiscussionSortBy = 'newest' | 'oldest';

// --- Epic ---
handle.epic().on(DiscussionActions.load, ({ loadMore }) => {
  return Rx.concatObs(
    Rx.of(DiscussionActions.setIsLoading(true)),
    api
      .discussion_searchComments({
        challengeId: getChallengeState().challenge.id,
        sortDesc: true,
        cursor: loadMore ? getDiscussionState().cursor : null,
      })
      .pipe(
        Rx.map(ret => DiscussionActions.loaded(loadMore, ret)),
        handleAppError()
      ),
    Rx.of(DiscussionActions.setIsLoading(false))
  );
});

// --- Reducer ---
const initialState: ApiSpecState = {
  isLoaded: false,
  isLoading: false,
  isSubmitting: false,
  items: [],
  cursor: null,
  sortBy: {
    label: 'Newest',
    value: 'newest',
  },
};

handle
  .reducer(initialState)
  .on(DiscussionActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(DiscussionActions.loaded, (state, { loadMore, result }) => {
    state.cursor = result.cursor;
    state.isLoaded = true;
    if (loadMore) {
      state.items.push(...result.items);
    } else {
      state.items = result.items;
    }
  })
  .on(DiscussionActions.setIsLoading, (state, { isLoading }) => {
    state.isLoading = isLoading;
  })
  .on(DiscussionActions.setIsSubmitting, (state, { isSubmitting }) => {
    state.isSubmitting = isSubmitting;
  })
  .on(DiscussionActions.commentCreated, (state, { comment }) => {
    if (comment.parentCommentId) {
      state.items.forEach(item => {
        if (item.id === comment.parentCommentId) {
          item.children.push(comment);
        }
      });
    } else {
      state.items.unshift(comment);
    }
  });

const LoaderWrapper = styled.div`
  padding: 120px 0;
  text-align: center;
`;

const Wrapper = styled.div`
  padding: 40px 50px;
`;

const NoData = styled.div`
  text-align: center;
  margin-top: 40px;
`;

const CommentsWrapper = styled.div`
  border-radius: 5px;
  border: 1px solid ${Theme.grayLight};
`;

export function DiscussionTab() {
  const { isLoaded, items, isLoading, cursor } = getDiscussionState.useState();
  const { load } = useActions(DiscussionActions);
  React.useEffect(() => {
    if (!isLoaded) {
      load(false);
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    );
  }

  const renderComment = () => {
    if (!items.length) {
      return <NoData data-test="no-comments">{'No Comments'}</NoData>;
    }
    return (
      <div>
        <SortOptions />
        {/* <CommentsWrapper> */}
        {items.map(item => (
          <CommentItem comment={item} key={item.id} />
        ))}
        {/* </CommentsWrapper> */}
      </div>
    );
  };

  return (
    <Wrapper>
      <AddComment showBanner />
      {renderComment()}
    </Wrapper>
  );
}

// --- Module ---
export function useDiscussionModule() {
  handle();
}
