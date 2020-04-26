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
import { useSolutionOrNull } from 'src/features/globalSolutions/useSolutions';

const SpinnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
`;

interface SolutionModalProps {
  visibleChallengeId?: number;
  onTagClick?(tag: string): void;
}

export function SolutionModal(props: SolutionModalProps) {
  const { onTagClick, visibleChallengeId } = props;
  useSolutionModule();
  const { close, showViewMode } = useActions(SolutionActions);
  const { isOpened, mode, solutionId, isLoading } = getSolutionState.useState();
  const solution = useSolutionOrNull(solutionId!);

  return (
    <Modal
      testId="solution-modal"
      size="md"
      isOpen={isOpened}
      close={source => {
        if (source === 'close-button' && solutionId && mode === 'edit') {
          showViewMode();
        } else {
          close();
        }
      }}
      noBackgroundClose={mode === 'edit'}
    >
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
          {mode === 'edit' ? (
            <SolutionForm
              challengeId={solution?.challengeId ?? visibleChallengeId ?? 0}
            />
          ) : (
            <ViewSolution
              onTagClick={
                onTagClick
                  ? tag => {
                      close();
                      onTagClick(tag);
                    }
                  : undefined
              }
            />
          )}
        </FormModalContent>
      )}
    </Modal>
  );
}
