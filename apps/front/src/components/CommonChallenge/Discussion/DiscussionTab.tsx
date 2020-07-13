import { Loader } from 'src/components/Loader';
import * as Rx from 'src/rx';
import { createModule, useActions } from 'typeless';
import React from 'react';
import styled from 'styled-components';
import { AddComment } from './AddComment';
import { api } from 'src/services/api';
import { handleAppError, getErrorMessage } from 'src/common/helper';
import { LoadMoreResult, DiscussionComment } from 'shared';
import { SelectOption, DeleteType, TargetChallengeValues } from 'src/types';
import { SortOptions } from './SortOptions';
import { CommentItem } from './CommentItem';
import { ConfirmModalActions } from 'src/features/confirmModal/interface';
import { useUser } from 'src/hooks/useUser';
import { LoadMoreButton } from 'src/components/LoadMoreButton';
import { Theme, MOBILE } from 'ui';
import { GlobalActions } from 'src/features/global/interface';
import { DiscussionSymbol } from '../symbol';

export const [handle, DiscussionActions, getDiscussionState] = createModule(
  DiscussionSymbol
)
  .withActions({
    $init: null,
    initTarget: (target: TargetChallengeValues) => ({ payload: { target } }),
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
    deleteComment: (comment: DiscussionComment) => ({ payload: { comment } }),
    commentDeleted: (id: string) => ({ payload: { id } }),
    markAsAnswer: (comment: DiscussionComment) => ({ payload: { comment } }),
  })
  .withState<DiscussionState>();

interface DiscussionState {
  isLoaded: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  items: DiscussionComment[];
  cursor: string | null;
  sortBy: SelectOption<DiscussionSortBy>;
  target: TargetChallengeValues;
}

export type DiscussionSortBy = 'newest' | 'oldest';

// --- Epic ---
handle
  .epic()
  .on(DiscussionActions.load, ({ loadMore }) => {
    const { target } = getDiscussionState();
    return Rx.concatObs(
      Rx.of(DiscussionActions.setIsLoading(true)),
      api
        .discussion_searchComments({
          ...target,
          sortDesc: getDiscussionState().sortBy.value === 'newest',
          cursor: loadMore ? getDiscussionState().cursor : null,
        })
        .pipe(
          Rx.map(ret => DiscussionActions.loaded(loadMore, ret)),
          handleAppError()
        ),
      Rx.of(DiscussionActions.setIsLoading(false))
    );
  })
  .on(DiscussionActions.updateSort, () => DiscussionActions.load(false))
  .on(DiscussionActions.markAsAnswer, ({ comment }) => {
    return Rx.concatObs(
      Rx.of(DiscussionActions.setIsLoading(true)),
      api
        .discussion_markAnswer(comment.id)
        .pipe(Rx.ignoreElements(), handleAppError()),
      Rx.of(DiscussionActions.setIsLoading(false))
    );
  })
  .on(DiscussionActions.deleteComment, ({ comment }, { action$ }) => {
    return Rx.concatObs(
      Rx.of(
        ConfirmModalActions.show(
          'Confirm',
          'Are you sure to delete this comment?',
          [
            { text: 'Delete', type: 'danger', value: 'delete' as DeleteType },
            { text: 'Cancel', type: 'secondary', value: 'close' as DeleteType },
          ]
        )
      ),
      action$.pipe(
        Rx.waitForType(ConfirmModalActions.onResult),
        Rx.mergeMap(({ payload }) => {
          const result = payload.result as DeleteType;
          if (result !== 'delete') {
            return Rx.of(ConfirmModalActions.close());
          }
          return Rx.concatObs(
            Rx.of(ConfirmModalActions.setIsLoading('delete' as DeleteType)),
            api.discussion_deleteComment(comment.id).pipe(
              Rx.mergeMap(() => [
                DiscussionActions.commentDeleted(comment.id),
                ConfirmModalActions.close(),
              ]),
              Rx.catchLog(e => [
                ConfirmModalActions.close(),
                GlobalActions.showAppError(getErrorMessage(e)),
              ])
            ),
            Rx.of(ConfirmModalActions.setIsLoading(null))
          );
        })
      )
    );
  });

// --- Reducer ---
const initialState: DiscussionState = {
  isLoaded: false,
  isLoading: false,
  isSubmitting: false,
  items: [],
  cursor: null,
  sortBy: {
    label: 'Newest',
    value: 'newest',
  },
  target: null!,
};

handle
  .reducer(initialState)
  .on(DiscussionActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(DiscussionActions.initTarget, (state, { target }) => {
    state.target = target;
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
  })
  .on(DiscussionActions.commentDeleted, (state, { id }) => {
    state.items.forEach(item => {
      if (item.id === id) {
        item.isDeleted = true;
      } else {
        item.children.forEach(sub => {
          if (sub.id === id) {
            sub.isDeleted = true;
          }
        });
      }
    });
  })
  .on(DiscussionActions.markAsAnswer, (state, { comment }) => {
    state.items.forEach(item => {
      item.children.forEach(sub => {
        if (sub.id === comment.id) {
          sub.isAnswer = true;
          item.isAnswered = true;
        }
      });
    });
  })
  .on(DiscussionActions.updateSort, (state, { sortBy }) => {
    state.sortBy = sortBy;
  });

const LoaderWrapper = styled.div`
  padding: 120px 0;
  text-align: center;
`;

const Wrapper = styled.div`
  padding: 40px 50px;

  ${MOBILE} {
    padding: 20px 25px;
  }
`;

const NoData = styled.div`
  text-align: center;
  margin-top: 40px;
`;

const Separator = styled.div`
  border-top: 1px solid ${Theme.grayLight};
  margin-top: 30px;
`;

interface DiscussionTabProps {
  target: TargetChallengeValues;
}

export function DiscussionTab(props: DiscussionTabProps) {
  const { target } = props;
  const { isLoaded, items, isLoading, cursor } = getDiscussionState.useState();
  const { load, initTarget } = useActions(DiscussionActions);
  const user = useUser();

  React.useEffect(() => {
    if (!isLoaded) {
      initTarget(target);
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
        {items.map(item => (
          <CommentItem user={user} comment={item} key={item.id} />
        ))}
        {cursor && (
          <LoadMoreButton isLoading={isLoading} onClick={() => load(true)} />
        )}
      </div>
    );
  };

  return (
    <Wrapper>
      {user && (
        <>
          <AddComment showBanner />
          <Separator />
        </>
      )}
      {renderComment()}
    </Wrapper>
  );
}

// --- Module ---
export function useDiscussionModule() {
  handle();
}
