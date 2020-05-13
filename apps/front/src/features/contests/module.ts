import * as Rx from 'src/rx';
import { ContestsActions, ContestsState, handle } from './interface';
import {
  ContestsFormActions,
  useContestsForm,
  getContestsFormState,
} from './contests-form';
import { api } from 'src/services/api';
import { handleAppError } from 'src/common/helper';

// --- Epic ---
handle
  .epic()
  .on(ContestsActions.$mounted, () => ContestsFormActions.reset())
  .on(ContestsFormActions.setSubmitSucceeded, () => {
    return Rx.concatObs(
      Rx.of(ContestsActions.setIsSubmitting(true)),
      api
        .featureSubscription_createFeatureSubscription(
          'contest',
          getContestsFormState().values.email
        )
        .pipe(
          Rx.map(() => ContestsActions.setSubmitted()),
          handleAppError()
        ),
      Rx.of(ContestsActions.setIsSubmitting(false))
    );
  });

// --- Reducer ---
const initialState: ContestsState = {
  isSubmitted: false,
  isSubmitting: false,
};

handle
  .reducer(initialState)
  .on(ContestsActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(ContestsActions.setSubmitted, state => {
    state.isSubmitted = true;
  })
  .on(ContestsActions.setIsSubmitting, (state, { isSubmitting }) => {
    state.isSubmitting = isSubmitting;
  });

// --- Module ---
export function useContestsModule() {
  useContestsForm();
  handle();
}
