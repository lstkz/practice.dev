import * as React from 'react';
import styled, { css } from 'styled-components';

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
  flex?: boolean;
}

export const Container = styled.div<ContainerProps>`
  @media (min-width: 992px) {
    max-width: 960px;
  }
  @media (min-width: 1200px) {
    max-width: 1140px;
  }
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-right: 15px;
  padding-left: 15px;
  ${props =>
    props.flex &&
    css`
      /* display: flex; */
      flex: 1 0 0;
    `}
`;
