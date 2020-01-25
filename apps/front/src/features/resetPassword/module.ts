import * as Rx from 'src/rx';
import { ResetPasswordActions, ResetPasswordState, handle } from './interface';
import {
  ResetPasswordFormActions,
  getResetPasswordFormState,
} from './resetPassword-form';
import { api } from 'src/services/api';
import { getErrorMessage } from 'src/common/helper';

// --- Epic ---
handle
  .epic()
  .on(ResetPasswordActions.$init, () => ResetPasswordFormActions.reset())
  .on(ResetPasswordFormActions.setSubmitSucceeded, () => {
    return Rx.concatObs(
      Rx.of(ResetPasswordActions.setSubmitting(true)),
      Rx.of(ResetPasswordActions.setError(null)),
      api.user_resetPassword(getResetPasswordFormState().values.email).pipe(
        Rx.map(() => ResetPasswordActions.setDone()),
        Rx.catchLog(e => {
          return Rx.of(ResetPasswordActions.setError(getErrorMessage(e)));
        })
      ),
      Rx.of(ResetPasswordActions.setSubmitting(false))
    );
  });

// --- Reducer ---
const initialState: ResetPasswordState = {
  isSubmitting: false,
  isDone: false,
  error: null,
};

handle
  .reducer(initialState)
  .on(ResetPasswordActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(ResetPasswordActions.setSubmitting, (state, { isSubmitting }) => {
    state.isSubmitting = isSubmitting;
  })
  .on(ResetPasswordActions.setDone, state => {
    state.isDone = true;
  })
  .on(ResetPasswordActions.setError, (state, { error }) => {
    state.error = error;
  });

// --- Module ---
export function useResetPasswordModule() {
  handle();
}
