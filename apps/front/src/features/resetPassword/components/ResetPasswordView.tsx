import React from 'react';
import { Button } from 'src/components/Button';
import { Link } from '../../../components/Link';
import {
  ResetPasswordFormProvider,
  ResetPasswordFormActions,
} from '../resetPassword-form';
import { FormInput } from '../../../components/FormInput';
import { FullPageForm } from '../../../components/FullPageForm';
import { createUrl } from '../../../common/url';
import { useActions } from 'typeless';
import { getResetPasswordState, ResetPasswordActions } from '../interface';
import { Alert } from 'src/components/Alert';
import { PasswordResetSuccess } from './PasswordResetSuccess';
import { RegisterActions } from 'src/features/register/interface';

interface ResetPasswordViewProps {
  isModal?: boolean;
}

export function ResetPasswordView(props?: ResetPasswordViewProps) {
  const { isModal } = props || {};
  const { submit } = useActions(ResetPasswordFormActions);
  const { hideModal } = useActions(ResetPasswordActions);
  const { showModal: showRegisterModal } = useActions(RegisterActions);
  const {
    isSubmitting,
    error,
    isDone,
    isModalOpen,
  } = getResetPasswordState.useState();

  if (isDone) {
    return <PasswordResetSuccess isModal={isModal} />;
  }

  return (
    <FullPageForm
      modal={
        isModal
          ? {
              onClose: hideModal,
              isOpen: isModalOpen,
            }
          : null
      }
      testId="reset-password-form"
      title="Reset Password"
      subTitle="We will send you an email that will allow you to reset your password."
      bottom={
        <>
          Not registered?{' '}
          <Link
            onClick={e => {
              if (isModal) {
                hideModal();
                showRegisterModal();
                e.preventDefault();
              }
            }}
            testId="register-link"
            href={createUrl({ name: 'register' })}
          >
            Create account
          </Link>
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
          {error && (
            <Alert testId="reset-password-error" type="error">
              {error}
            </Alert>
          )}

          <FormInput
            testId="email-input"
            id="email"
            name="email"
            label="Email address"
            placeholder="name@example.com"
          />
          <Button
            testId="reset-password-submit"
            type="primary"
            block
            loading={isSubmitting}
            htmlType="submit"
          >
            RESET PASSWORD
          </Button>
        </form>
      </ResetPasswordFormProvider>
    </FullPageForm>
  );
}
