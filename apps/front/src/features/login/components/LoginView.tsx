import React from 'react';
import { useLoginModule } from '../module';
import { Button } from '../../../components/Button';
import { PasswordIcon } from '../../../components/Icons/PasswordIcon';
import { EmailIcon } from '../../../components/Icons/EmailIcon';
import { Link } from '../../../components/Link';
import {
  useLoginForm,
  LoginFormProvider,
  LoginFormActions,
} from '../login-form';
import { FormInput } from '../../../components/FormInput';
import { FullPageForm } from '../../../components/FullPageForm';
import { createUrl } from '../../../common/url';
import { SocialFormButtons } from '../../../components/SocialFormButtons';
import styled from 'styled-components';
import { Theme } from '../../../common/Theme';
import { useActions } from 'typeless';

const DashedLink = styled(Link)`
  font-size: 80%;
  font-weight: 400;
  border-bottom: 1px dashed;
  color: #8492a6;
  line-height: 1.7;
`;

export function LoginView() {
  useLoginForm();
  useLoginModule();
  const { submit } = useActions(LoginFormActions);

  return (
    <FullPageForm
      title="Login"
      subTitle="Sign in to your account to continue."
      bottom={
        <>
          Not registered?{' '}
          <Link href={createUrl({ name: 'register' })}>
            <strong>Create account</strong>
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
            rightLabel={
              <DashedLink href={createUrl({ name: 'forgot-password' })}>
                Lost password?
              </DashedLink>
            }
          />
          <Button type="primary" block>
            Sign in
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
      </LoginFormProvider>
    </FullPageForm>
  );
}
