import React from 'react';
import styled from 'styled-components';

import { MOBILE } from 'src/Theme';

interface RowProps {
  children?: React.ReactNode;
  className?: string;
  gutter?: number;
}

interface ColProps {
  children?: React.ReactNode;
  className?: string;
  lg?: number;
  center?: boolean;
}

export const Col = styled.div<ColProps>`
  position: relative;
  width: 100%;
  max-width: ${props => ((props.lg || 1) / 12) * 100}%;
  flex: 0 0 ${props => ((props.lg || 1) / 12) * 100}%;
  margin: ${props => (props.center ? '0 auto' : null)};
  ${MOBILE} {
    max-width: 100%;
    flex: 0 0 100%;
  }
`;

const DEFAULT_GUTTER = 30;

export const Row = styled.div<RowProps>`
  display: flex;
  margin-right: -${props => (props.gutter || DEFAULT_GUTTER) / 2}px;
  margin-left: -${props => (props.gutter || DEFAULT_GUTTER) / 2}px;
  flex-wrap: wrap;
  ${Col} {
    padding-right: ${props => (props.gutter || DEFAULT_GUTTER) / 2}px;
    padding-left: ${props => (props.gutter || DEFAULT_GUTTER) / 2}px;
  }
  ${MOBILE} {
    margin-left: 0;
    margin-right: 0;
    ${Col} + ${Col} {
      margin-top: ${DEFAULT_GUTTER / 2}px;
    }
  }
`;
