import * as React from 'react';
import styled from 'styled-components';
import { SolutionDetails } from 'src/components/SolutionDetails';
import { getSolutionState, SolutionActions } from '../interface';
import { useActions } from 'typeless';
import { GlobalSolutionsActions } from 'src/features/globalSolutions/interface';
import { useSolution } from 'src/features/globalSolutions/useSolutions';
import { useUser } from 'src/hooks/useUser';

interface ViewSolutionProps {
  className?: string;
  onTagClick?(tag: string): void;
}

const _ViewSolution = (props: ViewSolutionProps) => {
  const { className, onTagClick } = props;
  const { solutionId } = getSolutionState.useState();
  const { voteSolution } = useActions(GlobalSolutionsActions);
  const { show, remove } = useActions(SolutionActions);
  const solution = useSolution(solutionId!);
  const user = useUser();

  return (
    <div className={className}>
      <SolutionDetails
        canEdit={user && solution.user.id === user.id}
        solution={solution!}
        onMenu={action => {
          if (action === 'edit') {
            show('edit', solution);
          }
          if (action === 'delete') {
            remove();
          }
        }}
        voteSolution={voteSolution}
        onTagClick={onTagClick}
      />
    </div>
  );
};

export const ViewSolution = styled(_ViewSolution)`
  display: block;
`;
