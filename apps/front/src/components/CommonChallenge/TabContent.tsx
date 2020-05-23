import * as React from 'react';
import styled from 'styled-components';
import { Theme } from 'ui';

interface TabContentProps {
  className?: string;
  left: React.ReactNode;
  right: React.ReactNode;
  testId?: string;
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

const _TabContent = (props: TabContentProps) => {
  const { className, left, right, testId } = props;
  return (
    <div className={className} data-test={testId}>
      <Col1>{left}</Col1>
      <Col2>{right}</Col2>
    </div>
  );
};

export const TabContent = styled(_TabContent)`
  display: flex;
  padding: 40px 0;
`;
