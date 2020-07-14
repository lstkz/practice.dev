import * as React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Theme } from 'src/Theme';

const ripple = keyframes`  
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}`;

interface LoaderProps {
  className?: string;
  center?: boolean;
}

const Ripple = styled.div`
  position: absolute;
  border: 4px solid ${Theme.blue};
  opacity: 1;
  border-radius: 50%;
  animation: ${ripple} 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
`;

const Ripple2 = styled(Ripple as any)`
  animation-delay: -0.5s;
`;

const Inner = styled.div`
  display: inline-block;
  width: 80px;
  height: 80px;
  position: relative;
`;

const _Loader = (props: LoaderProps) => {
  const { className } = props;
  return (
    <div className={className}>
      <Inner>
        <Ripple />
        <Ripple2 />
      </Inner>
    </div>
  );
};

export const Loader = styled(_Loader)`
  ${props =>
    props.center &&
    css`
      text-align: center;
    `}
`;
