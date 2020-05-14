import * as React from 'react';
import styled from 'styled-components';
import { Theme } from 'ui';

interface TwoColLayoutProps {
  className?: string;
  width: number;
  left: React.ReactChild;
  right: React.ReactChild;
  relative?: boolean;
}

const Left = styled.div`
  padding: 0 30px;
  border-right: 1px solid ${Theme.grayLight};
`;

const Right = styled.div`
  padding: 0 50px;
`;

const _TwoColLayout = (props: TwoColLayoutProps) => {
  const { className, left, right } = props;
  return (
    <div className={className}>
      <Left>{left}</Left>
      <Right>{right}</Right>
    </div>
  );
};

export const TwoColLayout = styled(_TwoColLayout)`
  display: flex;
  padding: 40px 0;
  position: ${props => (props.relative ? 'relative' : null)};

  ${Left} {
    width: ${props => props.width}px;
  }
  ${Right} {
    width: calc(100% - ${props => props.width}px);
  }
`;
