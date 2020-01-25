import React from 'react';
import { useRegisterModule } from '../module';
import { Button } from '../../../components/Button';
import { Link } from '../../../components/Link';
import {
  useRegisterForm,
  RegisterFormProvider,
  RegisterFormActions,
} from '../register-form';
import { FormInput } from '../../../components/FormInput';
import { useActions } from 'typeless';
import { FullPageForm } from '../../../components/FullPageForm';
import { SocialFormButtons } from '../../../components/SocialFormButtons';
import { createUrl } from '../../../common/url';
import { getRegisterState } from '../interface';
import { Alert } from './node_modules/src/components/Alert';
import { Colored } from './node_modules/src/components/Colored';

export function RegisterView() {
  useRegisterForm();
  useRegisterModule();
  const { submit } = useActions(RegisterFormActions);
  const { isSubmitting, error } = getRegisterState.useState();

  return (
    <FullPageForm
      title="Create your account"
      subTitle={
        <>
          Made with <Colored color="pink">♥</Colored> for developers.
        </>
      }
      bottom={
        <>
          Already have an account?{' '}
          <Link href={createUrl({ name: 'login' })}>Sign in</Link>
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
          {error && <Alert type="error">{error}</Alert>}
          <FormInput
            id="username"
            name="username"
            label="Username"
            placeholder="coder"
          />

          <FormInput
            id="email"
            name="email"
            label="Email Address"
            placeholder="name@example.com"
          />

          <FormInput
            id="password"
            name="password"
            label="Password"
            placeholder="********"
            type="password"
          />
          <FormInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="********"
            type="password"
          />
          <Button type="primary" block loading={isSubmitting} htmlType="submit">
            CREATE MY ACCOUNT
          </Button>
          <SocialFormButtons
            onGithubClick={() => {
              //
            }}
            onGoogleClick={() => {
              //
            }}
          />
        </form>
      </RegisterFormProvider>
    </FullPageForm>
  );
}
