import * as React from 'react';
import styled from 'styled-components';
import { Theme } from 'src/common/Theme';
import { Stats } from './Stats';
import { getChallengeState } from '../interface';

interface DetailsTabProps {
  className?: string;
}

const Col1 = styled.div`
  flex-grow: 1;
  padding: 0 50px;
`;
const Col2 = styled.div`
  width: 300px;
  padding: 0 30px;
  flex-shrink: 0;
  border-left: 1px solid ${Theme.grayLight};
`;

const _DetailsTab = (props: DetailsTabProps) => {
  const { className } = props;
  const Component = getChallengeState.useState().component;
  return (
    <div className={className}>
      <Col1>
        <Component />
      </Col1>
      <Col2>
        <Stats />
      </Col2>
    </div>
  );
};

export const DetailsTab = styled(_DetailsTab)`
  display: flex;
  padding: 40px 0;
`;
