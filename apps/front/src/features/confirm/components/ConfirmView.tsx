import React from 'react';
import { useConfirmModule } from '../module';
import { Spinner } from '@pvd/ui';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export function ConfirmView() {
  useConfirmModule();

  return (
    <Wrapper data-test="confirm-page">
      <Spinner blue size="40px" />
    </Wrapper>
  );
}
