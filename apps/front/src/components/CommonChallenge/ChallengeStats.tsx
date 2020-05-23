import * as React from 'react';
import styled from 'styled-components';
import { VoidLink } from '../VoidLink';
import { SidebarTitle } from './SidebarTitle';

interface ChallengeStatsProps {
  className?: string;
  children: React.ReactNode;
}

export const ChallengeStatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 11px;
  line-height: 19px;
`;

const _ChallengeStats = (props: ChallengeStatsProps) => {
  const { className, children } = props;
  return (
    <div className={className} data-test="challenge-stats">
      <SidebarTitle>Stats</SidebarTitle>
      {children}
    </div>
  );
};

export const ChallengeStats = styled(_ChallengeStats)`
  display: block;
  ${VoidLink} {
    font-weight: 500;
  }
`;
