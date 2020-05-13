import * as React from 'react';
import styled from 'styled-components';

interface SwaggerSectionProps {
  className?: string;
  title: string;
  children: React.ReactChild;
}

const Title = styled.div`
  margin-bottom: 15px;
  font-weight: 500;
`;

const _SwaggerSection = (props: SwaggerSectionProps) => {
  const { className, title, children } = props;
  return (
    <div className={className}>
      <Title>{title}</Title>
      {children}
    </div>
  );
};

export const SwaggerSection = styled(_SwaggerSection)`
  display: block;
  margin-top: 25px;
`;
