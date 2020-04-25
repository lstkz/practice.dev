import * as React from 'react';
import styled from 'styled-components';
import { OverviewSection } from './OverviewSection';
import { EmptySection } from './EmptySection';

interface OverviewContentProps {
  className?: string;
}

const _OverviewContent = (props: OverviewContentProps) => {
  const { className } = props;
  return (
    <div className={className}>
      <OverviewSection title="Badges">
        <EmptySection>No badges</EmptySection>
      </OverviewSection>
      <OverviewSection title="Rating">
        <EmptySection>User is not rated</EmptySection>
      </OverviewSection>
      <OverviewSection title="Activity">
        <EmptySection>No activity</EmptySection>
      </OverviewSection>
    </div>
  );
};

export const OverviewContent = styled(_OverviewContent)`
  display: block;
`;
