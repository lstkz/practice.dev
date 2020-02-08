import React from 'react';
import { useConfirmModalModule } from '../module';
import { useActions } from 'typeless';
import { ConfirmModalActions, getConfirmModalState } from '../interface';
import { Modal, Button } from 'ui';
import styled from 'styled-components';

const Title = styled.div``;
const Desc = styled.div``;

const Content = styled.div``;

const Buttons = styled.div`
display: flex;
${Button} + ${Button} {
  margin-left: 10px;
}
`;

export function ConfirmModalView() {
  useConfirmModalModule();
  const { close, onResult } = useActions(ConfirmModalActions);
  const {
    isOpened,
    title,
    description,
    buttons,
  } = getConfirmModalState.useState();

  return (
    <Modal isOpen={isOpened} close={close}>
      <Content>
        <Title>{title}</Title>
        <Desc>{description}</Desc>
        <Buttons>
          {buttons.map(item => (
            <Button
              key={item.value}
              type={item.type}
              onClick={() => onResult(item.value)}
            >
              {item.text}
            </Button>
          ))}
        </Buttons>
      </Content>
    </Modal>
  );
}
