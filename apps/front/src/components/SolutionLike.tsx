import * as React from 'react';
import styled from 'styled-components';
import { VoidLink } from './VoidLink';
import { Theme } from 'ui';
import { Solution } from 'shared';
import { LikeIcon } from 'src/icons/LikeIcon';
import ReactTooltip from 'react-tooltip';

const Like = styled(VoidLink)`
  display: inline-flex;
  align-items: center;
  color: ${Theme.pink};
  margin-right: 5px;
  && {
    text-decoration: none;
  }
  &:hover {
    path {
      fill: ${Theme.pink};
    }
  }
`;

interface SolutionLikeProps {
  voteSolution(id: string, like: boolean): any;
  className?: string;
  solution: Solution;
}

const _SolutionLike = (props: SolutionLikeProps) => {
  const { className, voteSolution, solution } = props;
  return (
    <div className={className}>
      <Like
        onClick={() => {
          voteSolution(solution.id, !solution.isLiked);
        }}
        data-tip={solution.isLiked ? 'Unlike' : 'Like'}
      >
        <LikeIcon size="16px" empty={!solution.isLiked} />
      </Like>
      {solution.likes}
      <ReactTooltip place="top" type="dark" effect="solid" />
    </div>
  );
};

export const SolutionLike = styled(_SolutionLike)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
