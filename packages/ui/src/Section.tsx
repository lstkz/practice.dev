import React from 'react';
import styled from 'styled-components';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Wrapper = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin-bottom: 5px;
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
