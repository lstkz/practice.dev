import * as Rx from 'src/rx';
import React from 'react';
import { S } from 'schema';
import { EmailSectionSymbol, EmailFormSymbol } from '../symbol';
import { createModule, useActions } from 'typeless';
import { createForm } from 'typeless-form';
import { validate, getErrorMessage } from 'src/common/helper';
import { api } from 'src/services/api';
import { SettingsSection } from './SettingsSection';
import { FormInput } from 'src/components/FormInput';
import { Alert } from 'src/components/Alert';
import { SuccessFilledIcon } from 'src/icons/SuccessFilledIcon';
import { Button } from 'ui';
import { useUser } from 'src/hooks/useUser';
import { getGlobalState } from 'src/features/global/interface';

export const [handle, EmailSectionActions, getEmailSectionState] = createModule(
  EmailSectionSymbol
)
  .withActions({
    $init: null,
    $mounted: null,
    setIsSubmitting: (isSubmitting: boolean) => ({ payload: { isSubmitting } }),
    setIsDone: (isDone: boolean, sentEmail: string) => ({
      payload: { isDone, sentEmail },
    }),
    setError: (error: string) => ({ payload: { error } }),
  })
  .withState<EmailSectionState>();

interface EmailSectionState {
  isDone: boolean;
  isSubmitting: boolean;
  error: string | null;
  sentEmail: string | null;
}

const initialState: EmailSectionState = {
  isDone: false,
  isSubmitting: false,
  error: null,
  sentEmail: null,
};

export interface EmailFormValues {
  email: string;
}
export const [
  useEmailForm,
  EmailFormActions,
  getEmailFormState,
  EmailFormProvider,
] = createForm<EmailFormValues>({
  symbol: EmailFormSymbol,
  validator: (errors, values) => {
    validate(
      errors,
      values,
      S.object().keys({
        email: S.string().email(),
      })
    );
  },
});
handle
  .epic()
  .on(EmailSectionActions.$mounted, () => [
    EmailFormActions.reset(),
    EmailFormActions.changeMany({
      email: getGlobalState().user!.email,
    }),
  ])
  .on(EmailFormActions.setSubmitSucceeded, () => {
    const { values } = getEmailFormState();
    return Rx.concatObs(
      Rx.of(EmailSectionActions.setIsSubmitting(true)),
      api.user_changeEmail(values.email).pipe(
        Rx.map(() => EmailSectionActions.setIsDone(true, values.email)),
        Rx.catchLog(e => {
          return Rx.of(EmailSectionActions.setError(getErrorMessage(e)));
        })
      ),
      Rx.of(EmailSectionActions.setIsSubmitting(false))
    );
  });

handle
  .reducer(initialState)
  .on(EmailSectionActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(EmailFormActions.setSubmitSucceeded, state => {
    state.isDone = false;
    state.sentEmail = null;
    state.error = null;
  })
  .on(EmailSectionActions.setIsDone, (state, { isDone, sentEmail }) => {
    state.isDone = isDone;
    state.error = null;
    state.sentEmail = sentEmail;
  })
  .on(EmailSectionActions.setIsSubmitting, (state, { isSubmitting }) => {
    state.isSubmitting = isSubmitting;
  })
  .on(EmailSectionActions.setError, (state, { error }) => {
    state.error = error;
  });

export function EmailSection() {
  useEmailForm();
  handle();
  const {
    isSubmitting,
    isDone,
    error,
    sentEmail,
  } = getEmailSectionState.useState();
  const orgEmail = useUser().email;
  const currentEmail = getEmailFormState.useState().values.email;
  const { submit } = useActions(EmailFormActions);

  return (
    <SettingsSection title="Email">
      <EmailFormProvider>
        <form
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <FormInput
            maxLength={40}
            testId="email-input"
            id="email"
            name="email"
            label="Email"
          />

          {error && (
            <Alert type="error" testId="email-update-error">
              {error}
            </Alert>
          )}
          {isDone && (
            <Alert type="success" testId="email-update-success">
              <SuccessFilledIcon />
              Please check "{sentEmail}" to confirm your new email.
            </Alert>
          )}
          <Button
            testId="change-email-submit"
            type="primary"
            block
            loading={isSubmitting}
            htmlType="submit"
            disabled={orgEmail === currentEmail || isDone}
          >
            CHANGE EMAIL
          </Button>
        </form>
      </EmailFormProvider>
    </SettingsSection>
  );
}
