import * as React from 'react';
import styled, { css } from 'styled-components';
import { VoidLink } from './VoidLink';
import { CloseIcon } from 'src/icons/CloseIcon';
import { MOBILE, Theme } from 'src/Theme';

interface AppBannerProps {
  className?: string;
  type: 'success' | 'error';
  children: React.ReactNode;
  onClose(): void;
  testId: string;
}

const Inner = styled.div`
  max-width: 600px;
  display: flex;
  align-items: center;
  svg {
    margin-right: 12px;
  }
`;

const Close = styled(VoidLink)`
  position: absolute;
  top: 50%;
  right: 50px;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${MOBILE} {
    right: 10px;
  }
`;

const _AppBanner = (props: AppBannerProps) => {
  const { className, children, onClose, testId } = props;
  return (
    <div className={className} data-test={testId}>
      <Inner>{children}</Inner>
      <Close aria-label="close" onClick={onClose}>
        <CloseIcon scale={1.3} />
      </Close>
    </div>
  );
};

export const AppBanner = styled(_AppBanner)`
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 1px 3px #0000001c;
  padding: 15px 40px;
  position: relative;
  position: sticky;
  top: 0;
  z-index: 2;

  ${props => {
    switch (props.type) {
      case 'error':
        return css`
          background: ${Theme.red};
          color: white;
        `;
      case 'success':
        return css`
          background: ${Theme.lightGreen2};
          color: ${Theme.textDark};
          line {
            stroke: ${Theme.textDark};
          }
        `;
        return null;
    }
  }}
`;
