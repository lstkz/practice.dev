import React from 'react';
import { Modal } from 'src/components/Modal';
import { FormModalContent } from './FormModalContent';
import styled from 'styled-components';
import { getGlobalState, GlobalActions } from 'src/features/global/interface';
import { useActions } from 'typeless';

const Text = styled.div`
  text-align: center;
`;

export function ErrorModal() {
  const { isOpen, message } = getGlobalState.useState().errorModal;
  const { hideErrorModal } = useActions(GlobalActions);

  return (
    <Modal
      testId="error-modal"
      size="sm"
      isOpen={isOpen}
      close={hideErrorModal}
    >
      <FormModalContent title="Error">
        <Text data-test="error-msg">{message}</Text>
      </FormModalContent>
    </Modal>
  );
}
