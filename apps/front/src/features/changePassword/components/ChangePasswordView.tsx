import React from 'react';
import { useChangePasswordModule } from '../module';
import { Button } from '../../../components/Button';
import { Link } from '../../../components/Link';
import {
  useChangePasswordForm,
  ChangePasswordFormProvider,
  ChangePasswordFormActions,
} from '../changePassword-form';
import { FormInput } from '../../../components/FormInput';
import { useActions } from 'typeless';
import { FullPageForm } from '../../../components/FullPageForm';
import { getChangePasswordState } from '../interface';
import { Alert } from 'src/components/Alert';

export function ChangePasswordView() {
  useChangePasswordForm();
  useChangePasswordModule();
  const { submit } = useActions(ChangePasswordFormActions);
  const { isSubmitting, error } = getChangePasswordState.useState();

  return (
    <FullPageForm
      title="Change Password"
      subTitle={
        <>
          We will send you an email that will allow you to change your password
        </>
      }
    >
      <ChangePasswordFormProvider>
        <form
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          {error && <Alert type="error">{error}</Alert>}
          <FormInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="********"
            type="password"
          />
          <Button type="primary" block loading={isSubmitting} htmlType="submit">
            CHANGE PASSWORD
          </Button>
        </form>
      </ChangePasswordFormProvider>
    </FullPageForm>
  );
}
