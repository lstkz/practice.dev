import * as React from 'react';
import styled from 'styled-components';
import { Title } from 'src/components/Title';

interface OverviewSectionProps {
  className?: string;
  children?: React.ReactChild;
  title: string;
}

const _OverviewSection = (props: OverviewSectionProps) => {
  const { className, title, children } = props;
  return (
    <div className={className}>
      <Title mb="md">{title}</Title>
      {children}
    </div>
  );
};

export const OverviewSection = styled(_OverviewSection)`
  display: block;
  margin-bottom: 35px;
`;
