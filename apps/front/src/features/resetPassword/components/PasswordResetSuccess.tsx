import * as React from 'react';
import styled from 'styled-components';
import { FullPageForm } from 'src/components/FullPageForm';
import { MailSuccessIcon } from 'src/icons/MailSuccessIcon';
import { useActions } from 'typeless';
import { ResetPasswordActions, getResetPasswordState } from '../interface';
import { Theme } from 'src/Theme';

const Content = styled.div`
  border-radius: 5px;
  background: ${Theme.lightGreen};
  text-align: center;
  padding: 15px 45px 30px;
  color: ${Theme.textDark};
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

interface PasswordResetSuccessProps {
  isModal?: boolean;
}

export function PasswordResetSuccess(props: PasswordResetSuccessProps) {
  const { isModal } = props;
  const { hideModal } = useActions(ResetPasswordActions);
  const { isModalOpen } = getResetPasswordState.useState();
  return (
    <FullPageForm
      testId="reset-password-success"
      title="Reset Password"
      padding="sm"
      modal={
        isModal
          ? {
              onClose: hideModal,
              isOpen: isModalOpen,
            }
          : null
      }
    >
      <Content>
        <Icon>
          <MailSuccessIcon />
        </Icon>
        An email has been sent to your email address with further instruction
        how to reset your password.
        <br />
        Please check your email.
      </Content>
    </FullPageForm>
  );
}
