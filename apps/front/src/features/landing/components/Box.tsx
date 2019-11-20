import * as React from 'react';
import styled from 'styled-components';

interface BoxProps {
  className?: string;
  title: string;
  text: string;
  icon?: React.ReactChild;
}

const Icon = styled.div`
  svg {
    max-width: 32px;
    height: auto;
  }
  margin-top: 5px;
  margin-right: 16px;
`;

const _Box = (props: BoxProps) => {
  const { className, icon, title, text } = props;
  return (
    <div className={className}>
      <Icon>{icon}</Icon>
      <div>
        <h5>{title}</h5>
        <p>{text}</p>
      </div>
    </div>
  );
};

export const Box = styled(_Box)`
  padding: 72px 0;
  display: flex;
  p {
    line-height: 1.9;
  }
  h5 {
    margin-top: 0;
  }
`;
