import * as Rx from 'src/rx';
import * as R from 'remeda';
import {
  RegisterActions,
  RegisterState,
  handle,
  getRegisterState,
} from './interface';
import { RegisterFormActions, getRegisterFormState } from './register-form';
import { api } from 'src/services/api';
import { GlobalActions } from '../global/interface';
import { getErrorMessage } from 'src/common/helper';
import { AuthData } from 'shared';

// --- Epic ---

function authWith(fn: () => Rx.Observable<AuthData>) {
  const { isModalOpen } = getRegisterState();

  return Rx.concatObs(
    Rx.of(RegisterActions.setSubmitting(true)),
    Rx.of(RegisterActions.setError(null)),
    fn().pipe(
      Rx.mergeMap(ret => {
        if (isModalOpen) {
          return [GlobalActions.auth(ret, true), RegisterActions.hideModal()];
        }
        return [GlobalActions.auth(ret)];
      }),
      Rx.catchLog(e => {
        return Rx.of(RegisterActions.setError(getErrorMessage(e)));
      })
    ),
    Rx.of(RegisterActions.setSubmitting(false))
  );
}

handle
  .epic()
  .onMany([RegisterActions.$init, RegisterActions.showModal], () =>
    RegisterFormActions.reset()
  )
  .on(RegisterFormActions.setSubmitSucceeded, () => {
    const values = R.omit(getRegisterFormState().values, ['confirmPassword']);
    return authWith(() => api.user_register(values));
  })
  .on(GlobalActions.githubCallback, ({ code }) => {
    return authWith(() => api.user_authGithub(code));
  })
  .on(GlobalActions.googleCallback, ({ token }) => {
    return authWith(() => api.user_authGoogle(token));
  });

// --- Reducer ---
const initialState: RegisterState = {
  isModalOpen: false,
  isSubmitting: false,
  error: null,
};

handle
  .reducer(initialState)
  .on(RegisterActions.$init, state => {
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
  handle();
}
