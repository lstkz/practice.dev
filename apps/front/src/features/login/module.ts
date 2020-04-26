import * as Rx from 'src/rx';
import { LoginActions, LoginState, handle, getLoginState } from './interface';
import {
  LoginFormActions,
  getLoginFormState,
  useLoginForm,
} from './login-form';
import { api } from 'src/services/api';
import { GlobalActions } from '../global/interface';
import { getErrorMessage, handleAuth } from 'src/common/helper';
import { AuthData } from 'shared';
import { isRoute } from 'src/common/url';

// --- Epic ---

function authWith(
  action$: Rx.Observable<any>,
  fn: () => Rx.Observable<AuthData>
) {
  const { isModalOpen } = getLoginState();

  return Rx.concatObs(
    Rx.of(LoginActions.setSubmitting(true)),
    Rx.of(LoginActions.setError(null)),
    fn().pipe(
      Rx.mergeMap(authData =>
        handleAuth({
          authData,
          isModalOpen,
          hideModal: LoginActions.hideModal,
          reset: LoginActions.reset,
          action$,
        })
      ),
      Rx.catchLog(e => {
        return Rx.of(LoginActions.setError(getErrorMessage(e)));
      })
    ),
    Rx.of(LoginActions.setSubmitting(false))
  );
}

function getIsActive() {
  return getLoginState().isModalOpen || isRoute('login');
}

handle
  .epic()
  .onMany([LoginActions.showModal, LoginActions.reset], () =>
    LoginFormActions.reset()
  )
  .on(LoginFormActions.setSubmitSucceeded, ({}, { action$ }) => {
    return authWith(action$, () => api.user_login(getLoginFormState().values));
  })
  .on(GlobalActions.githubCallback, ({ code }, { action$ }) => {
    if (!getIsActive()) {
      return Rx.empty();
    }
    return authWith(action$, () => api.user_authGithub(code));
  })
  .on(GlobalActions.googleCallback, ({ token }, { action$ }) => {
    if (!getIsActive()) {
      return Rx.empty();
    }
    return authWith(action$, () => api.user_authGoogle(token));
  });

// --- Reducer ---
const initialState: LoginState = {
  isModalOpen: false,
  isSubmitting: false,
  error: null,
};

handle
  .reducer(initialState)
  .on(LoginActions.reset, state => {
    Object.assign(state, initialState);
  })
  .on(LoginActions.showModal, state => {
    Object.assign(state, initialState);
    state.isModalOpen = true;
  })
  .on(LoginActions.hideModal, state => {
    state.isModalOpen = false;
  })
  .on(LoginActions.setSubmitting, (state, { isSubmitting }) => {
    state.isSubmitting = isSubmitting;
  })
  .on(LoginActions.setError, (state, { error }) => {
    state.error = error;
  });

// --- Module ---
export function useLoginModule() {
  useLoginForm();
  handle();
}
