import React from 'react';
import { useResetPasswordModule } from '../module';
import { Button } from '../../../components/Button';
import { Link } from '../../../components/Link';
import {
  useResetPasswordForm,
  ResetPasswordFormProvider,
  ResetPasswordFormActions,
} from '../resetPassword-form';
import { FormInput } from '../../../components/FormInput';
import { FullPageForm } from '../../../components/FullPageForm';
import { createUrl } from '../../../common/url';
import { useActions } from 'typeless';
import { getResetPasswordState } from '../interface';
import { Alert } from 'src/components/Alert';
import { PasswordResetSuccess } from './PasswordResetSuccess';

export function ResetPasswordView() {
  useResetPasswordForm();
  useResetPasswordModule();
  const { submit } = useActions(ResetPasswordFormActions);
  const { isSubmitting, error, isDone } = getResetPasswordState.useState();

  if (isDone) {
    return <PasswordResetSuccess />;
  }

  return (
    <FullPageForm
      title="Reset Password"
      subTitle="We will send you an email that will allow you to reset your password."
      bottom={
        <>
          Not registered?{' '}
          <Link href={createUrl({ name: 'register' })}>Create account</Link>
        </>
      }
    >
      <ResetPasswordFormProvider>
        <form
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          {error && <Alert type="error">{error}</Alert>}

          <FormInput
            id="email"
            name="email"
            label="Email address"
            placeholder="name@example.com"
          />
          <Button type="primary" block loading={isSubmitting} htmlType="submit">
            RESET PASSWORD
          </Button>
        </form>
      </ResetPasswordFormProvider>
    </FullPageForm>
  );
}
