import * as Rx from 'src/rx';
import { handle, SolutionActions, SolutionState } from './interface';
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

handle
  .epic()
  .on(SolutionFormActions.setSubmitSucceeded, () => {
    const { values } = getSolutionFormState();

    return Rx.concatObs(
      Rx.of(SolutionActions.setError(null)),
      Rx.of(SolutionActions.setIsSubmitting(true)),
      api
        .solution_createSolution({
          challengeId: getChallengeState().challenge.id,
          tags: values.tags.map(x => x.value),
          title: values.title,
          slug: values.slug,
          description: values.description,
          url: values.url,
        })
        .pipe(
          Rx.mergeMap(solution => {
            return [SolutionActions.show('view', solution)];
          }),
          Rx.catchLog(e => Rx.of(SolutionActions.setError(getErrorMessage(e))))
        ),
      Rx.of(SolutionActions.setIsSubmitting(false))
    );
  })
  .on(SolutionActions.show, () => [
    SolutionFormActions.reset(),
    SolutionActions.setError(null),
  ])
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
  );

// --- Reducer ---
const initialState: SolutionState = {
  isOpened: false,
  error: '',
  isSubmitting: false,
  solutionId: null,
  mode: 'edit',
  isLoading: false,
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
  });

// --- Module ---
export function useSolutionModule() {
  handle();
  useSolutionForm();
}
