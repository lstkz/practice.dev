import * as React from 'react';
import styled from 'styled-components';
import { SolutionDetails } from 'src/components/SolutionDetails';
import { getSolutionState } from '../interface';

interface ViewSolutionProps {
  className?: string;
}

const _ViewSolution = (props: ViewSolutionProps) => {
  const { className } = props;
  const { solution } = getSolutionState.useState();

  return (
    <div className={className}>
      <SolutionDetails
        solution={solution!}
        onMenu={() => {}}
        voteSolution={() => {}}
      />
    </div>
  );
};

export const ViewSolution = styled(_ViewSolution)`
  display: block;
`;
