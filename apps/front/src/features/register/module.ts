import * as Rx from 'src/rx';
import * as R from 'remeda';
import {
  RegisterActions,
  RegisterState,
  handle,
  getRegisterState,
} from './interface';
import {
  RegisterFormActions,
  getRegisterFormState,
  useRegisterForm,
} from './register-form';
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
  const { isModalOpen } = getRegisterState();

  return Rx.concatObs(
    Rx.of(RegisterActions.setSubmitting(true)),
    Rx.of(RegisterActions.setError(null)),
    fn().pipe(
      Rx.mergeMap(authData =>
        handleAuth({
          authData,
          isModalOpen,
          hideModal: RegisterActions.hideModal,
          reset: RegisterActions.reset,
          action$,
        })
      ),
      Rx.catchLog(e => {
        return Rx.of(RegisterActions.setError(getErrorMessage(e)));
      })
    ),
    Rx.of(RegisterActions.setSubmitting(false))
  );
}

function getIsActive() {
  return getRegisterState().isSubmitting || isRoute('register');
}

handle
  .epic()
  .onMany([RegisterActions.showModal, RegisterActions.reset], () =>
    RegisterFormActions.reset()
  )
  .on(RegisterFormActions.setSubmitSucceeded, ({}, { action$ }) => {
    const values = R.omit(getRegisterFormState().values, ['confirmPassword']);
    return authWith(action$, () => api.user_register(values));
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
const initialState: RegisterState = {
  isModalOpen: false,
  isSubmitting: false,
  error: null,
};

handle
  .reducer(initialState)
  .on(RegisterActions.reset, state => {
    Object.assign(state, initialState);
  })
  .on(RegisterActions.showModal, state => {
    Object.assign(state, initialState);
    state.isModalOpen = true;
  })
  .on(RegisterActions.hideModal, state => {
    state.isModalOpen = false;
  })
  .on(RegisterActions.setSubmitting, (state, { isSubmitting }) => {
    state.isSubmitting = isSubmitting;
  })
  .on(RegisterActions.setError, (state, { error }) => {
    state.error = error;
  });

// --- Module ---
export function useRegisterModule() {
  useRegisterForm();
  handle();
}
