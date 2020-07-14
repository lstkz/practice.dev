import React from 'react';
import { Button } from 'src/components/Button';
import { Link } from '../../../components/Link';
import { LoginFormProvider, LoginFormActions } from '../login-form';
import { FormInput } from '../../../components/FormInput';
import { FullPageForm } from '../../../components/FullPageForm';
import { createUrl } from '../../../common/url';
import { useActions } from 'typeless';
import { getLoginState, LoginActions } from '../interface';
import { Alert } from 'src/components/Alert';
import { SocialFormButtons } from 'src/components/SocialFormButtons';
import { RegisterActions } from 'src/features/register/interface';
import { ResetPasswordActions } from 'src/features/resetPassword/interface';

export interface LoginViewProps {
  isModal?: boolean;
}

export function LoginView(props?: LoginViewProps) {
  const { isModal } = props || {};
  const { submit } = useActions(LoginFormActions);
  const { hideModal } = useActions(LoginActions);
  const { showModal: showRegisterModal } = useActions(RegisterActions);
  const { showModal: showResetPasswordModal } = useActions(
    ResetPasswordActions
  );
  const { isSubmitting, error, isModalOpen } = getLoginState.useState();

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
      testId="login-form"
      title="Login"
      subTitle="Sign in to your account to continue."
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
      <LoginFormProvider>
        <form
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          {error && (
            <Alert testId="login-error" type="error">
              {error}
            </Alert>
          )}

          <FormInput
            testId="login-input"
            id="emailOrUsername"
            name="emailOrUsername"
            label="Username or Email"
            placeholder="name@example.com or coder"
          />
          <FormInput
            testId="password-input"
            id="password"
            name="password"
            label="Password"
            placeholder="********"
            type="password"
            rightLabel={
              <Link
                onClick={e => {
                  if (isModal) {
                    hideModal();
                    showResetPasswordModal();
                    e.preventDefault();
                  }
                }}
                testId="reset-password-link"
                href={createUrl({ name: 'reset-password' })}
              >
                Lost password?
              </Link>
            }
          />
          <Button
            testId="login-submit"
            type="primary"
            block
            loading={isSubmitting}
            htmlType="submit"
          >
            SIGN IN
          </Button>
          <SocialFormButtons />
        </form>
      </LoginFormProvider>
    </FullPageForm>
  );
}
