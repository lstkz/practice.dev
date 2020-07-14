import React from 'react';
import { useConfirmModalModule } from '../module';
import { useActions } from 'typeless';
import { ConfirmModalActions, getConfirmModalState } from '../interface';
import { Button } from 'src/components/Button';
import { Modal } from 'src/components/Modal';
import styled from 'styled-components';
import { FormModalContent } from 'src/components/FormModalContent';
import { Alert } from 'src/components/Alert';

const Desc = styled.div`
  font-size: 14px;
  margin-bottom: 30px;
  text-align: center;
`;

const Buttons = styled.div`
width: 100%;
display: flex;
justify-content: center;
${Button} + ${Button} {
  margin-left: 10px;
}
`;

export function ConfirmModalView() {
  useConfirmModalModule();
  const { onResult } = useActions(ConfirmModalActions);
  const {
    isOpened,
    title,
    description,
    buttons,
    loadingButton,
    error,
  } = getConfirmModalState.useState();

  return (
    <Modal
      testId="confirm-modal"
      size="sm"
      isOpen={isOpened}
      close={() => onResult('close')}
    >
      <FormModalContent title={title}>
        {error && <Alert type="error">{error}</Alert>}
        <Desc>{description}</Desc>
        <Buttons>
          {buttons.map(item => (
            <Button
              testId={`${item.value}-btn`}
              key={item.value}
              type={item.type}
              onClick={() => onResult(item.value)}
              loading={loadingButton === item.value}
            >
              {item.text}
            </Button>
          ))}
        </Buttons>
      </FormModalContent>
    </Modal>
  );
}
