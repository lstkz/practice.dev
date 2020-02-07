import React from 'react';
import { Modal } from 'src/components/Modal';
import { useActions } from 'typeless';
import { SolutionActions, getSolutionState } from '../interface';
import { useSolutionModule } from '../module';
import { FormModalContent } from 'src/components/FormModalContent';
import { SolutionForm } from './SolutionForm';
import { ViewSolution } from './ViewSolution';

export function SolutionModal() {
  useSolutionModule();
  const { close } = useActions(SolutionActions);
  const { isOpened, mode, solution } = getSolutionState.useState();

  return (
    <Modal size="md" isOpen={isOpened} close={close}>
      <FormModalContent
        title={
          mode === 'view'
            ? undefined
            : solution
            ? 'Edit Solution'
            : 'Create Solution'
        }
      >
        {mode === 'edit' ? <SolutionForm /> : <ViewSolution />}
      </FormModalContent>
    </Modal>
  );
}
