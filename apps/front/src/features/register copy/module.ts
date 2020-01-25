import * as Rx from './node_modules/src/rx';
import * as R from 'remeda';
import { RegisterActions, RegisterState, handle } from './interface';
import { RegisterFormActions, getRegisterFormState } from './register-form';
import { api } from './node_modules/src/services/api';
import { GlobalActions } from '../global/interface';
import { getErrorMessage } from './node_modules/src/common/helper';

// --- Epic ---
handle
  .epic()
  .on(RegisterActions.$init, () => RegisterFormActions.reset())
  .on(RegisterFormActions.setSubmitSucceeded, () => {
    const values = R.omit(getRegisterFormState().values, ['confirmPassword']);
    return Rx.concatObs(
      Rx.of(RegisterActions.setSubmitting(true)),
      Rx.of(RegisterActions.setError(null)),
      api.user_register(values).pipe(
        Rx.map(ret => GlobalActions.auth(ret)),
        Rx.catchLog(e => {
          return Rx.of(RegisterActions.setError(getErrorMessage(e)));
        })
      ),
      Rx.of(RegisterActions.setSubmitting(false))
    );
  });

// --- Reducer ---
const initialState: RegisterState = {
  isSubmitting: false,
  error: null,
};

handle
  .reducer(initialState)
  .on(RegisterActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(RegisterActions.setSubmitting, (state, { isSubmitting }) => {
    state.isSubmitting = isSubmitting;
  })
  .on(RegisterActions.setError, (state, { error }) => {
    state.error = error;
  });

// --- Module ---
export function useRegisterModule() {
  handle();
}
