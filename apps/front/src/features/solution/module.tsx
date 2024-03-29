import * as Rx from 'src/rx';
import {
  handle,
  SolutionActions,
  SolutionState,
  getSolutionState,
} from './interface';
import {
  useSolutionForm,
  SolutionFormActions,
  getSolutionFormState,
} from './solution-form';
import { api } from 'src/services/api';
import { getChallengeState } from '../challenge/interface';
import { getErrorMessage, searchSolutionTags } from 'src/common/helper';
import { GlobalSolutionsActions } from '../globalSolutions/interface';
import { GlobalActions } from '../global/interface';
import { confirmDeleteSolution } from 'src/common/solution';
import { RouterActions, getRouterState } from 'typeless-router';
import { createUrl, isRoute } from 'src/common/url';
import { MAX_SLUG_LENGTH } from 'shared';

handle
  .epic()
  .on(SolutionFormActions.setSubmitSucceeded, () => {
    const { values } = getSolutionFormState();
    const { solutionId } = getSolutionState();

    return Rx.concatObs(
      Rx.of(SolutionActions.setError(null)),
      Rx.of(SolutionActions.setIsSubmitting(true)),
      Rx.defer(() => {
        const updateValues = {
          challengeId: 0,
          tags: values.tags.map(x => x.value),
          title: values.title,
          slug: values.slug,
          description: values.description,
          url: values.url,
        };
        if (solutionId) {
          delete updateValues.challengeId;
          return api.solution_updateSolution(solutionId, updateValues);
        } else {
          updateValues.challengeId = getChallengeState().challenge.id;
          return api.solution_createSolution(updateValues);
        }
      }).pipe(
        Rx.mergeMap(solution => {
          const actions: any[] = [
            GlobalSolutionsActions.addSolutions([solution]),
          ];
          const url = createUrl({
            name: 'challenge',
            id: solution.challengeId,
            solutionSlug: solution.slug,
          });
          const [pathname, search] = url.split('?');
          if (!solutionId) {
            actions.push(SolutionActions.created());
            actions.push(
              RouterActions.push({
                pathname: pathname,
                search,
              })
            );
          } else {
            const shouldRedirect = isRoute('challenge');
            if (
              shouldRedirect &&
              search !== getRouterState().location?.search
            ) {
              actions.push(
                RouterActions.replace({
                  pathname: pathname,
                  search,
                })
              );
            }
            actions.push(SolutionActions.show('view', solution));
          }
          return actions;
        }),
        Rx.catchLog(e => Rx.of(SolutionActions.setError(getErrorMessage(e))))
      ),
      Rx.of(SolutionActions.setIsSubmitting(false))
    );
  })
  .on(SolutionActions.show, ({ mode, solution }) => {
    const actions = [
      SolutionFormActions.reset(),
      SolutionActions.setError(null),
    ];
    if (mode === 'edit' && solution) {
      actions.push(
        SolutionFormActions.changeMany({
          description: solution.description,
          slug: solution.slug,
          tags: solution.tags.map(tag => ({
            label: tag,
            value: tag,
          })),
          title: solution.title,
          url: solution.url,
        })
      );
    }
    return actions;
  })
  .on(SolutionFormActions.change, ({ field, value }) => {
    if (field === 'title') {
      const slug = (value as string)
        .toLowerCase()
        .trim()
        .split('')
        .map(c => {
          if (/[a-z0-9\-]/.test(c)) {
            return c;
          } else {
            return '-';
          }
        })
        .join('')
        .substr(0, MAX_SLUG_LENGTH);
      return SolutionFormActions.change('slug', slug);
    }
    return Rx.empty();
  })
  .on(
    SolutionActions.loadSolutionBySlug,
    ({ challengeId, slug }, { action$ }) => {
      return api.solution_getSolutionBySlug(challengeId, slug).pipe(
        Rx.mergeMap(solution => [
          GlobalSolutionsActions.addSolutions([solution]),
          SolutionActions.show('view', solution),
        ]),
        Rx.catchLog((e: any) => {
          return Rx.from([
            GlobalActions.showAppError(getErrorMessage(e)),
            SolutionActions.close(),
          ]);
        }),
        Rx.takeUntil(action$.pipe(Rx.waitForType(SolutionActions.close)))
      );
    }
  )
  .on(SolutionActions.remove, (_, { action$ }) => {
    const solutionId = getSolutionState().solutionId!;
    return confirmDeleteSolution({
      solutionId,
      action$,
      getOnCloseAction: () => SolutionActions.close(),
    });
  })
  .on(SolutionActions.searchTags, ({ keyword, resolve, cursor }) => {
    return searchSolutionTags(
      getChallengeState().challenge.id,
      keyword,
      cursor,
      resolve
    );
  });

// --- Reducer ---
const initialState: SolutionState = {
  isOpened: false,
  error: '',
  isSubmitting: false,
  solutionId: null,
  mode: 'edit',
  isLoading: false,
  tags: {
    cursor: null,
    items: [],
    isLoaded: false,
    keyword: '',
  },
};

handle
  .reducer(initialState)
  .on(SolutionActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(SolutionActions.setError, (state, { error }) => {
    state.error = error;
  })
  .on(SolutionActions.show, (state, { solution, mode }) => {
    Object.assign(state, initialState);
    state.mode = mode;
    state.solutionId = solution ? solution.id : null;
    state.isOpened = true;
  })
  .on(SolutionActions.loadSolutionBySlug, state => {
    Object.assign(state, initialState);
    state.isOpened = true;
    state.isLoading = true;
  })
  .on(SolutionActions.close, state => {
    state.isOpened = false;
  })
  .on(SolutionActions.setIsSubmitting, (state, { isSubmitting }) => {
    state.isSubmitting = isSubmitting;
  })
  .on(SolutionActions.showViewMode, state => {
    state.mode = 'view';
  });

// --- Module ---
export function useSolutionModule() {
  handle();
  useSolutionForm();
}
