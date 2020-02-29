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
import { getErrorMessage } from 'src/common/helper';
import { GlobalSolutionsActions } from '../globalSolutions/interface';
import { GlobalActions } from '../global/interface';
import { ConfirmModalActions } from '../confirmModal/interface';

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
          challengeId: getChallengeState().challenge.id,
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
          return api.solution_createSolution(updateValues);
        }
      }).pipe(
        Rx.mergeMap(solution => {
          return [
            GlobalSolutionsActions.addSolutions([solution]),
            SolutionActions.show('view', solution),
          ];
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
        .join('');
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
    return Rx.concatObs(
      Rx.of(
        ConfirmModalActions.show(
          'Confirm',
          'Are you sure to delete this solution?',
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
            api.solution_removeSolution(solutionId).pipe(
              Rx.mergeMap(() => [
                ConfirmModalActions.close(),
                SolutionActions.close(),
                GlobalSolutionsActions.removeSolution(solutionId),
              ]),
              Rx.catchLog(e =>
                Rx.of(ConfirmModalActions.setError(getErrorMessage(e)))
              )
            ),
            Rx.of(ConfirmModalActions.setIsLoading(null))
          );
        })
      )
    );
  })
  .on(SolutionActions.searchTags, ({ keyword, resolve, cursor }) => {
    return api
      .challengeTags_searchChallengeTags({
        challengeId: getChallengeState().challenge.id,
        cursor,
        keyword,
      })
      .pipe(
        Rx.mergeMap(ret => {
          const options = ret.items.map(x => ({
            label: `${x.name} (${x.count})`,
            value: x.name,
          }));
          resolve({
            options,
            hasMore: !!ret.cursor,
            additional: ret.cursor,
          });
          return Rx.empty();
        }),
        Rx.catchLog(() => {
          return Rx.empty();
        })
      );
  });

type DeleteType = 'delete' | 'close';

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
