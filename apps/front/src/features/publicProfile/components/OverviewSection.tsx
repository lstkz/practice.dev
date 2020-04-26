import * as React from 'react';
import styled from 'styled-components';
import { Theme } from 'ui';

interface OverviewSectionProps {
  className?: string;
  children?: React.ReactChild;
  title: string;
}

const Title = styled.div`
  font-size: 18px;
  line-height: 24px;
  font-weight: 500;
  margin-bottom: 20px;
  color: ${Theme.textDark};
`;

const _OverviewSection = (props: OverviewSectionProps) => {
  const { className, title, children } = props;
  return (
    <div className={className}>
      <Title>{title}</Title>
      {children}
    </div>
  );
};

export const OverviewSection = styled(_OverviewSection)`
  display: block;
  margin-bottom: 35px;
`;
