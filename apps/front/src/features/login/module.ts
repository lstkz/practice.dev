import * as Rx from 'src/rx';
import { LoginActions, LoginState, handle } from './interface';
import { LoginFormActions, getLoginFormState } from './login-form';
import { api } from 'src/services/api';
import { GlobalActions } from '../global/interface';

function getError(e: any) {
  const message = e?.response?.error || e.message;
  return message.replace('ContractError: ', '');
}

// --- Epic ---
handle
  .epic()
  .on(LoginActions.$init, () => LoginFormActions.reset())
  .on(LoginFormActions.setSubmitSucceeded, () => {
    return Rx.concatObs(
      Rx.of(LoginActions.setSubmitting(true)),
      Rx.of(LoginActions.setError(null)),
      api.call('user.login', getLoginFormState().values).pipe(
        Rx.map(ret => GlobalActions.loggedIn(ret.user)),
        Rx.catchLog(e => {
          return Rx.of(LoginActions.setError(getError(e)));
        })
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
