import React from 'react';
import styled from 'styled-components';
import { Theme } from './Theme';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Wrapper = styled.div`
  margin-bottom: 10px;
  margin-top: 40px;
  &:first-child {
    margin-top: 0;
  }
`;

const Title = styled.h2`
  margin: 0 0 10px;
  font-weight: 500;
  font-size: 18px;
  color: ${Theme.textDark};
`;

export function Section(props: SectionProps) {
  const { title, children } = props;
  return (
    <Wrapper>
      <Title>{title}</Title>
      {children}
    </Wrapper>
  );
}
