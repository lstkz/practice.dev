import * as React from 'react';
import styled from 'styled-components';
import { getChallengeState } from '../interface';
import { SidebarTitle } from './SidebarTitle';
import { VoidLink } from 'src/components/VoidLink';

interface StatsProps {
  className?: string;
}

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 11px;
  line-height: 19px;
`;

const _Stats = (props: StatsProps) => {
  const { className } = props;
  const { challenge } = getChallengeState.useState();
  return (
    <div className={className}>
      <SidebarTitle>Stats</SidebarTitle>
      <Row>
        Submissions <VoidLink>{challenge.stats.submissions}</VoidLink>
      </Row>
      <Row>
        Solved <VoidLink>{challenge.stats.solved}</VoidLink>
      </Row>
      <Row>
        Solution <VoidLink>{challenge.stats.solutions}</VoidLink>
      </Row>
    </div>
  );
};

export const Stats = styled(_Stats)`
  display: block;
  ${VoidLink} {
    font-weight: 500;
  }
`;
