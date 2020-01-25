import * as Rx from 'src/rx';
import * as R from 'remeda';
import {
  ChangePasswordActions,
  ChangePasswordState,
  handle,
} from './interface';
import {
  ChangePasswordFormActions,
  getChangePasswordFormState,
} from './changePassword-form';
import { api } from 'src/services/api';
import { GlobalActions } from '../global/interface';
import { getErrorMessage } from 'src/common/helper';
import { getRouteParams } from 'src/common/url';

// --- Epic ---
handle
  .epic()
  .on(ChangePasswordActions.$init, () => ChangePasswordFormActions.reset())
  .on(ChangePasswordFormActions.setSubmitSucceeded, () => {
    const values = R.omit(getChangePasswordFormState().values, [
      'confirmPassword',
    ]);
    const { code } = getRouteParams('reset-password');
    return Rx.concatObs(
      Rx.of(ChangePasswordActions.setSubmitting(true)),
      Rx.of(ChangePasswordActions.setError(null)),
      api.user_confirmResetPassword(code, values.password).pipe(
        Rx.map(ret => GlobalActions.auth(ret)),
        Rx.catchLog(e => {
          return Rx.of(ChangePasswordActions.setError(getErrorMessage(e)));
        })
      ),
      Rx.of(ChangePasswordActions.setSubmitting(false))
    );
  });

// --- Reducer ---
const initialState: ChangePasswordState = {
  isSubmitting: false,
  error: null,
};

handle
  .reducer(initialState)
  .on(ChangePasswordActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(ChangePasswordActions.setSubmitting, (state, { isSubmitting }) => {
    state.isSubmitting = isSubmitting;
  })
  .on(ChangePasswordActions.setError, (state, { error }) => {
    state.error = error;
  });

// --- Module ---
export function useChangePasswordModule() {
  handle();
}
