import * as React from 'react';
import styled from 'styled-components';
import { SolutionDetails } from 'src/components/SolutionDetails';
import { getSolutionState } from '../interface';
import { useActions } from 'typeless';
import { GlobalSolutionsActions } from 'src/features/globalSolutions/interface';
import { useSolution } from 'src/features/globalSolutions/useSolutions';

interface ViewSolutionProps {
  className?: string;
}

const _ViewSolution = (props: ViewSolutionProps) => {
  const { className } = props;
  const { solutionId } = getSolutionState.useState();
  const { voteSolution } = useActions(GlobalSolutionsActions);
  const solution = useSolution(solutionId!);
  console.log({ solution });

  return (
    <div className={className}>
      <SolutionDetails
        solution={solution!}
        onMenu={() => {}}
        voteSolution={voteSolution}
      />
    </div>
  );
};

export const ViewSolution = styled(_ViewSolution)`
  display: block;
`;
