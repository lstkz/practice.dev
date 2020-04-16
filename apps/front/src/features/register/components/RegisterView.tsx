import React from 'react';
import { Button } from 'ui';
import { Link } from '../../../components/Link';
import { RegisterFormProvider, RegisterFormActions } from '../register-form';
import { FormInput } from '../../../components/FormInput';
import { useActions } from 'typeless';
import { FullPageForm } from '../../../components/FullPageForm';
import { SocialFormButtons } from '../../../components/SocialFormButtons';
import { createUrl } from '../../../common/url';
import { getRegisterState, RegisterActions } from '../interface';
import { Alert } from 'src/components/Alert';
import { Colored } from 'src/components/Colored';
import { LoginActions } from 'src/features/login/interface';

export interface RegisterViewProps {
  isModal?: boolean;
}

export function RegisterView(props?: RegisterViewProps) {
  const { isModal } = props || {};
  const { submit } = useActions(RegisterFormActions);
  const { hideModal } = useActions(RegisterActions);
  const { showModal: showLoginModal } = useActions(LoginActions);
  const { isSubmitting, error, isModalOpen } = getRegisterState.useState();

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
      testId="register-form"
      title="Create your account"
      subTitle={
        <>
          Made with <Colored color="pink">♥</Colored> for developers.
        </>
      }
      bottom={
        <>
          Already have an account?{' '}
          <Link
            onClick={e => {
              if (isModal) {
                showLoginModal();
                hideModal();
                e.preventDefault();
              }
            }}
            testId="login-link"
            href={createUrl({ name: 'login' })}
          >
            Sign in
          </Link>
        </>
      }
    >
      <RegisterFormProvider>
        <form
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          {error && (
            <Alert data-test="register-error" type="error">
              {error}
            </Alert>
          )}
          <FormInput
            testId="username-input"
            id="username"
            name="username"
            label="Username"
            placeholder="coder"
          />

          <FormInput
            testId="email-input"
            id="email"
            name="email"
            label="Email Address"
            placeholder="name@example.com"
          />

          <FormInput
            testId="password-input"
            id="password"
            name="password"
            label="Password"
            placeholder="********"
            type="password"
          />
          <FormInput
            testId="confirm-password-input"
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="********"
            type="password"
          />
          <Button
            testId="register-submit"
            type="primary"
            block
            loading={isSubmitting}
            htmlType="submit"
          >
            CREATE MY ACCOUNT
          </Button>
          <SocialFormButtons />
        </form>
      </RegisterFormProvider>
    </FullPageForm>
  );
}
