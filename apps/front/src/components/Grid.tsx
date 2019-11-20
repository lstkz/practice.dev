import React from 'react';
import { css, cx } from 'emotion';
import styled from 'styled-components';

interface RowProps {
  children?: React.ReactNode;
  className?: string;
}

export const Row = styled.div<RowProps>`
  display: flex;
  margin-right: -15px;
  margin-left: -15px;
  flex-wrap: wrap;
`;

interface ColProps {
  children?: React.ReactNode;
  className?: string;
  lg?: number;
}

export const Col = styled.div<ColProps>`
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  max-width: ${(props) => ((props.lg || 1) / 12) * 100}%;
  flex: 0 0 ${(props) => ((props.lg || 1) / 12) * 100}%;
`;
