import * as React from 'react';
import styled from 'styled-components';

const shadowMap = {
  default: 'rgba(18, 38, 63, 0.03) 0px 0.75rem 1.5rem',
  lg: 'rgba(31, 45, 61, 0.125) 0px 1rem 3rem;',
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  rounded?: 'default' | 'lg';
  shadow?: 'default' | 'lg';
}

export const Card = styled.div<CardProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0px;
  overflow-wrap: break-word;
  background-color: rgb(255, 255, 255);
  background-clip: border-box;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(239, 242, 247);
  border-image: initial;
  border-radius: 1rem;
  margin-bottom: 30px;
  box-shadow: ${props => shadowMap[props.shadow || 'default']};
  border-radius: 1rem;
  transition: all 0.2s ease 0s;
`;
