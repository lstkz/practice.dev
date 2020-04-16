import React from 'react';
import { useLoginModule } from '../module';
import { Button } from 'ui';
import { Link } from '../../../components/Link';
import {
  useLoginForm,
  LoginFormProvider,
  LoginFormActions,
} from '../login-form';
import { FormInput } from '../../../components/FormInput';
import { FullPageForm } from '../../../components/FullPageForm';
import { createUrl } from '../../../common/url';
import { useActions } from 'typeless';
import { getLoginState } from '../interface';
import { Alert } from 'src/components/Alert';
import { SocialFormButtons } from 'src/components/SocialFormButtons';

export function LoginView() {
  useLoginForm();
  useLoginModule();
  const { submit } = useActions(LoginFormActions);
  const { isSubmitting, error } = getLoginState.useState();

  return (
    <FullPageForm
      testId="login-form"
      title="Login"
      subTitle="Sign in to your account to continue."
      bottom={
        <>
          Not registered?{' '}
          <Link testId="register-link" href={createUrl({ name: 'register' })}>
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
            <Alert data-test="login-error" type="error">
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
