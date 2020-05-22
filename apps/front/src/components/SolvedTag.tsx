import * as React from 'react';
import styled from 'styled-components';
import { Theme } from 'src/common/Theme';

interface SolvedTagProps {
  className?: string;
  percent?: number;
}

const _SolvedTag = (props: SolvedTagProps) => {
  const { className, percent } = props;
  return (
    <div data-test="solved-tag" className={className}>
      {percent && percent < 100 ? `${percent}%` : ''} SOLVED
    </div>
  );
};

export const SolvedTag = styled(_SolvedTag)`
  display: flex;
  align-items: center;
  border-radius: 13px;
  font-weight: bold;
  font-size: 8px;
  color: white;
  height: 16px;
  padding: 0 5px;
  background: ${Theme.green};
`;
