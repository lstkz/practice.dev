import React from 'react';
import { useRegisterModule } from '../module';
import { Button } from '../../../components/Button';
import { PasswordIcon } from '../../../components/Icons/PasswordIcon';
import { EmailIcon } from '../../../components/Icons/EmailIcon';
import { AccountIcon } from '../../../components/Icons/AccountIcon';
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

export function RegisterView() {
  useRegisterForm();
  useRegisterModule();
  const { submit } = useActions(RegisterFormActions);

  return (
    <FullPageForm
      title="Create your account"
      subTitle="Made with love for developers."
      bottom={
        <>
          Already have an account?{' '}
          <Link href={createUrl({ name: 'login' })}>
            <strong>Sign in</strong>
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
          <FormInput
            name="username"
            label="username"
            placeholder="coder"
            icon={<AccountIcon />}
          />

          <FormInput
            name="email"
            label="email address"
            placeholder="name@example.com"
            icon={<EmailIcon />}
          />

          <FormInput
            name="password"
            label="password"
            placeholder="********"
            type="password"
            icon={<PasswordIcon />}
          />
          <FormInput
            name="confirmPassword"
            label="confirm password"
            placeholder="********"
            type="password"
            icon={<PasswordIcon />}
          />
          <Button type="primary" block htmlType="submit">
            Create my account
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
