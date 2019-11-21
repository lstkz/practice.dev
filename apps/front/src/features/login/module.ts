import * as Rx from 'src/rx';
import { LoginActions, LoginState, handle } from './interface';
import { LoginFormActions } from './login-form';

// --- Epic ---
handle
  .epic()
  .on(LoginActions.$init, () => LoginFormActions.reset())
  .on(LoginFormActions.setSubmitSucceeded, () => {
    return Rx.concatObs(
      Rx.of(LoginActions.setSubmitting(true)),
      Rx.of(LoginActions.setError(null)),
      Rx.of(LoginActions.setError('Invalid email or password')).pipe(
        Rx.delay(2000)
      ),
      Rx.of(LoginActions.setSubmitting(false))
    );
  });

// --- Reducer ---
const initialState: LoginState = {
  isSubmitting: false,
  error: null,
};

handle
  .reducer(initialState)
  .on(LoginActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(LoginActions.setSubmitting, (state, { isSubmitting }) => {
    state.isSubmitting = isSubmitting;
  })
  .on(LoginActions.setError, (state, { error }) => {
    state.error = error;
  });

// --- Module ---
export function useLoginModule() {
  handle();
}
