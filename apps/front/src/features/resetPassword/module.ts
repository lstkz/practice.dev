import * as Rx from 'src/rx';
import { ResetPasswordActions, ResetPasswordState, handle } from './interface';
import {
  ResetPasswordFormActions,
  getResetPasswordFormState,
  useResetPasswordForm,
} from './resetPassword-form';
import { api } from 'src/services/api';
import { getErrorMessage } from 'src/common/helper';
import { RouterActions } from 'typeless-router';

// --- Epic ---
handle
  .epic()
  .onMany([ResetPasswordActions.showModal, ResetPasswordActions.reset], () =>
    ResetPasswordFormActions.reset()
  )
  .on(ResetPasswordFormActions.setSubmitSucceeded, ({}, { action$ }) => {
    return Rx.concatObs(
      Rx.of(ResetPasswordActions.setSubmitting(true)),
      Rx.of(ResetPasswordActions.setError(null)),
      api.user_resetPassword(getResetPasswordFormState().values.email).pipe(
        Rx.mergeMap(() =>
          Rx.mergeObs(
            action$.pipe(
              Rx.waitForType(RouterActions.locationChange),
              Rx.map(() => ResetPasswordActions.reset())
            ),
            Rx.of(ResetPasswordActions.setDone())
          )
        ),
        Rx.catchLog(e => {
          return Rx.of(ResetPasswordActions.setError(getErrorMessage(e)));
        })
      ),
      Rx.of(ResetPasswordActions.setSubmitting(false))
    );
  });

// --- Reducer ---
const initialState: ResetPasswordState = {
  isModalOpen: false,
  isSubmitting: false,
  isDone: false,
  error: null,
};

handle
  .reducer(initialState)
  .on(ResetPasswordActions.reset, state => {
    Object.assign(state, initialState);
  })
  .on(ResetPasswordActions.showModal, state => {
    Object.assign(state, initialState);
    state.isModalOpen = true;
  })
  .on(ResetPasswordActions.hideModal, state => {
    state.isModalOpen = false;
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
  useResetPasswordForm();
  handle();
}
