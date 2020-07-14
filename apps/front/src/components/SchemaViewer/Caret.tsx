import * as React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from 'src/Theme';

interface CaretProps {
  className?: string;
  dir: 'top' | 'right' | 'bottom' | 'left';
}

const _Caret = (props: CaretProps) => {
  const { className } = props;
  return <div className={className} />;
};

export const Caret = styled(_Caret)`
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 5px solid ${Theme.textDark};
  transition: transform 0.2s ease;

  ${props => {
    switch (props.dir) {
      case 'right': {
        return css`
          transform: rotate(90deg);
        `;
      }
      case 'bottom': {
        return css`
          transform: rotate(180deg);
        `;
      }
      case 'left': {
        return css`
          transform: rotate(270deg);
        `;
      }
      default:
        return;
    }
  }}
`;
