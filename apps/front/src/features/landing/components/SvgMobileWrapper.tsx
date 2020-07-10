import * as React from 'react';
import styled from 'styled-components';
import { MOBILE } from 'ui';

interface SvgMobileWrapperProps {
  className?: string;
  children: React.ReactChild;
}

const _SvgMobileWrapper = (props: SvgMobileWrapperProps) => {
  const { className, children } = props;
  return <div className={className}>{children}</div>;
};

export const SvgMobileWrapper = styled(_SvgMobileWrapper)`
  ${MOBILE} {
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      width: 100%;
      height: auto;
      max-width: 700px;
      max-height: 400px;
    }
  }
`;
