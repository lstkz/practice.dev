import * as Rx from 'src/rx';
import { LoginActions, LoginState, handle } from './interface';
import { LoginFormActions, getLoginFormState } from './login-form';
import { api } from 'src/services/api';
import { GlobalActions } from '../global/interface';
import { getErrorMessage } from 'src/common/helper';
import { AuthData } from 'shared';

// --- Epic ---

function authWith(fn: () => Rx.Observable<AuthData>) {
  return Rx.concatObs(
    Rx.of(LoginActions.setSubmitting(true)),
    Rx.of(LoginActions.setError(null)),
    fn().pipe(
      Rx.map(ret => GlobalActions.auth(ret)),
      Rx.catchLog(e => {
        return Rx.of(LoginActions.setError(getErrorMessage(e)));
      })
    ),
    Rx.of(LoginActions.setSubmitting(false))
  );
}

handle
  .epic()
  .on(LoginActions.$init, () => LoginFormActions.reset())
  .on(LoginFormActions.setSubmitSucceeded, () => {
    return authWith(() => api.user_login(getLoginFormState().values));
  })
  .on(GlobalActions.githubCallback, ({ code }) => {
    return authWith(() => api.user_authGithub(code));
  })
  .on(GlobalActions.googleCallback, ({ token }) => {
    return authWith(() => api.user_authGoogle(token));
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
