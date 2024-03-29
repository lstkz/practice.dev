import * as React from 'react';
import styled from 'styled-components';
import { Theme, MOBILE } from 'src/Theme';

interface StepProps {
  className?: string;
  nr: number;
  children: React.ReactNode;
  icon: React.ReactNode;
}

const Icon = styled.div`
  width: 32px;
  position: absolute;
  top: 3px;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0;
  ${MOBILE} {
    display: flex;
    align-items: center;
    justify-content: center;
    position: static;
    transform: none;
    margin: 0 20px;
  }
`;
const Nr = styled.div`
  color: ${Theme.grayLight};
  top: 0;
  left: 10px;
  position: absolute;
  font-size: 24px;
  line-height: 32px;
  user-select: none;
  ${MOBILE} {
    position: static;
  }
`;

const Content = styled.div`
  ${MOBILE} {
    text-align: left;
  }
`;

const _Step = (props: StepProps) => {
  const { className, icon, children, nr } = props;
  return (
    <div className={className}>
      <Nr>{nr}.</Nr>
      <Icon>{icon}</Icon>
      <Content>{children}</Content>
    </div>
  );
};

export const Step = styled(_Step)`
  display: block;
  width: 240px;
  background: #ffffff;
  box-shadow: 0px 2px 6px ${Theme.shadow};
  border-radius: 5px;
  position: relative;
  margin-left: ${props => (props.nr % 2 === 0 ? 'auto' : 0)};
  padding: 30px 20px 19px;
  text-align: center;
  margin-bottom: 11px;
  line-height: 19px;

  ${MOBILE} {
    display: flex;
    align-items: center;
    width: 100%;
    margin-left: 0;
    padding: 20px;
  }
`;
