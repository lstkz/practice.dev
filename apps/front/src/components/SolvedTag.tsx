import * as React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from 'src/Theme';

interface SolvedTagProps {
  className?: string;
  percent?: number;
  large?: boolean;
}

const _SolvedTag = (props: SolvedTagProps) => {
  const { className, percent } = props;
  return (
    <div data-test="solved-tag" className={className}>
      {percent && percent < 100 ? `${Math.round(percent)}%` : ''} SOLVED
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
  white-space: pre;
  ${props =>
    props.large &&
    css`
      font-size: 14px;
      font-weight: 500;
      height: 24px;
      padding: 0 10px;
      line-height: 1;
    `}
`;
