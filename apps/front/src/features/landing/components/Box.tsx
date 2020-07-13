import * as React from 'react';
import styled from 'styled-components';
import { Title } from 'src/components/Title';
import { MOBILE } from 'ui';

interface BoxProps {
  className?: string;
  title: React.ReactNode;
  children: React.ReactNode;
  icon: React.ReactNode;
}

const Left = styled.div`
  svg {
    width: 60px;
  }
`;
const Right = styled.div`
  margin-left: 30px;
`;

const Desc = styled.div`
  margin-top: 10px;
`;

const _Box = (props: BoxProps) => {
  const { className, title, children, icon } = props;
  return (
    <div className={className}>
      <Left>{icon}</Left>
      <Right>
        <Title>{title}</Title>
        <Desc>{children}</Desc>
      </Right>
    </div>
  );
};

export const Box = styled(_Box)`
  display: flex;
  margin-top: 50px;
  ${MOBILE} {
    margin-top: 20px;
  }
`;
