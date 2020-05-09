import * as Rx from 'src/rx';
import React from 'react';
import { S } from 'schema';
import { PasswordSectionSymbol, PasswordFormSymbol } from '../symbol';
import { createModule, useActions } from 'typeless';
import { createForm } from 'typeless-form';
import { validate, getErrorMessage } from 'src/common/helper';
import { api } from 'src/services/api';
import { SettingsSection } from './SettingsSection';
import { FormInput } from 'src/components/FormInput';
import { Alert } from 'src/components/Alert';
import { SuccessFilledIcon } from 'src/icons/SuccessFilledIcon';
import { Button } from 'ui';
import { getPasswordSchema } from 'shared';

export const [
  handle,
  PasswordSectionActions,
  getPasswordSectionState,
] = createModule(PasswordSectionSymbol)
  .withActions({
    $init: null,
    $mounted: null,
    setIsSubmitting: (isSubmitting: boolean) => ({ payload: { isSubmitting } }),
    setIsDone: (isDone: boolean) => ({
      payload: { isDone },
    }),
    setError: (error: string) => ({ payload: { error } }),
  })
  .withState<PasswordSectionState>();

interface PasswordSectionState {
  isDone: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: PasswordSectionState = {
  isDone: false,
  isSubmitting: false,
  error: null,
};

export interface PasswordFormValues {
  password: string;
  confirmPassword: string;
}
export const [
  usePasswordForm,
  PasswordFormActions,
  getPasswordFormState,
  PasswordFormProvider,
] = createForm<PasswordFormValues>({
  symbol: PasswordFormSymbol,
  validator: (errors, values) => {
    validate(
      errors,
      values,
      S.object().keys({
        password: getPasswordSchema(),
        confirmPassword: S.string(),
      })
    );

    if (
      !errors.password &&
      !errors.confirmPassword &&
      values.password !== values.confirmPassword
    ) {
      errors.confirmPassword = 'Passwords do not match';
    }
  },
});
handle
  .epic()
  .on(PasswordSectionActions.$mounted, () => [PasswordFormActions.reset()])
  .on(PasswordFormActions.setSubmitSucceeded, () => {
    const { values } = getPasswordFormState();
    return Rx.concatObs(
      Rx.of(PasswordSectionActions.setIsSubmitting(true)),
      api.user_changePassword(values.password).pipe(
        Rx.map(() => PasswordSectionActions.setIsDone(true)),
        Rx.catchLog(e => {
          return Rx.of(PasswordSectionActions.setError(getErrorMessage(e)));
        })
      ),
      Rx.of(PasswordSectionActions.setIsSubmitting(false))
    );
  });

handle
  .reducer(initialState)
  .on(PasswordSectionActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(PasswordFormActions.setSubmitSucceeded, state => {
    state.isDone = false;
    state.error = null;
  })
  .on(PasswordSectionActions.setIsDone, (state, { isDone }) => {
    state.isDone = isDone;
    state.error = null;
  })
  .on(PasswordSectionActions.setIsSubmitting, (state, { isSubmitting }) => {
    state.isSubmitting = isSubmitting;
  })
  .on(PasswordSectionActions.setError, (state, { error }) => {
    state.error = error;
  });

export function PasswordSection() {
  usePasswordForm();
  handle();
  const { isSubmitting, isDone, error } = getPasswordSectionState.useState();
  const { submit } = useActions(PasswordFormActions);

  return (
    <SettingsSection title="Password">
      <PasswordFormProvider>
        <form
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <FormInput
            maxLength={40}
            type="password"
            testId="password-input"
            id="password"
            name="password"
            label="New Password"
          />
          <FormInput
            maxLength={40}
            type="password"
            testId="confirmPassword-input"
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
          />

          {error && (
            <Alert type="error" testId="password-update-error">
              {error}
            </Alert>
          )}
          {isDone && (
            <Alert type="success" testId="password-update-success">
              <SuccessFilledIcon />
              Password changed successfully.
            </Alert>
          )}
          <Button
            testId="change-password-submit"
            type="primary"
            block
            loading={isSubmitting}
            htmlType="submit"
          >
            CHANGE PASSWORD
          </Button>
        </form>
      </PasswordFormProvider>
    </SettingsSection>
  );
}
