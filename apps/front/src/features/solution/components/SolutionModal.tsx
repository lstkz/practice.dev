import React from 'react';
import { Modal } from 'src/components/Modal';
import { useActions } from 'typeless';
import { SolutionActions, getSolutionState } from '../interface';
import { useSolutionModule } from '../module';
import { FormModalContent } from 'src/components/FormModalContent';
import { SolutionForm } from './SolutionForm';
import { ViewSolution } from './ViewSolution';
import { Spinner } from 'ui';
import styled from 'styled-components';

const SpinnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
`;

export function SolutionModal() {
  useSolutionModule();
  const { close } = useActions(SolutionActions);
  const { isOpened, mode, solutionId, isLoading } = getSolutionState.useState();

  return (
    <Modal size="md" isOpen={isOpened} close={close}>
      {isLoading ? (
        <SpinnerWrapper>
          <Spinner blue size="40px" />
        </SpinnerWrapper>
      ) : (
        <FormModalContent
          title={
            mode === 'view'
              ? undefined
              : solutionId
              ? 'Edit Solution'
              : 'Create Solution'
          }
        >
          {mode === 'edit' ? <SolutionForm /> : <ViewSolution />}
        </FormModalContent>
      )}
    </Modal>
  );
}
