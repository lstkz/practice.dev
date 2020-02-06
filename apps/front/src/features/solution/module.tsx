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
          tags: [],
          title: values.title,
          slug: values.title,
          description: values.description,
          url: values.url,
        })
        .pipe(
          Rx.mergeMap(() => Rx.empty()),
          Rx.catchLog(e => Rx.of(SolutionActions.setError(getErrorMessage(e))))
        ),
      Rx.of(SolutionActions.setIsSubmitting(false))
    );
  })
  .on(SolutionActions.show, () => [
    SolutionFormActions.reset(),
    SolutionActions.setError(null),
  ]);

// --- Reducer ---
const initialState: SolutionState = {
  isOpened: false,
  error: '',
  isSubmitting: false,
};

handle
  .reducer(initialState)
  .on(SolutionActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(SolutionActions.setError, (state, { error }) => {
    state.error = error;
  })
  .on(SolutionActions.show, state => {
    state.isOpened = true;
    state.isSubmitting = false;
    state.error = null;
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
