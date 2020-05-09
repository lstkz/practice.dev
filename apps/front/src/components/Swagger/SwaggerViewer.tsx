import * as React from 'react';
import styled from 'styled-components';
import { Theme } from 'ui';
import { SwaggerMenu } from './SwaggerMenu';

interface SwaggerViewerProps {
  className?: string;
}

const Left = styled.div`
  padding: 0 30px;
  width: 230px;
  border-right: 1px solid ${Theme.grayLight};
`;

const Right = styled.div`
  padding: 0 50px;
  height: 2000px;
`;

const _SwaggerViewer = (props: SwaggerViewerProps) => {
  const { className } = props;
  return (
    <div className={className}>
      <Left>
        <SwaggerMenu />
      </Left>
      <Right></Right>
    </div>
  );
};

export const SwaggerViewer = styled(_SwaggerViewer)`
  display: flex;
  position: relative;
  padding-top: 40px;
  padding-bottom: 60px;
`;
