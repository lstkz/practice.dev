import * as React from 'react';
import styled from 'styled-components';
import { Theme } from 'src/common/Theme';
import { WarningIcon } from 'src/icons/WarningIcon';
import { CloseIcon } from 'src/icons/CloseIcon';
import { VoidLink } from './VoidLink';
import { getGlobalState, GlobalActions } from 'src/features/global/interface';
import { useActions } from 'typeless';

interface AppErrorBannerProps {
  className?: string;
}

const Inner = styled.div`
  max-width: 600px;
  display: flex;
  align-items: center;
  svg {
    margin-right: 12px;
  }
  color: white;
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
`;

const _AppErrorBanner = (props: AppErrorBannerProps) => {
  const { className } = props;
  const { appError } = getGlobalState.useState();
  const { hideAppError } = useActions(GlobalActions);
  if (!appError) {
    return null;
  }
  return (
    <div className={className} data-test="app-error">
      <Inner>
        <WarningIcon color={'white'} scale={1.3} />
        {appError.error}
        {appError.requestId && (
          <>
            <br />
            Request Id: {appError.requestId}
          </>
        )}
      </Inner>
      <Close aria-label="close" onClick={hideAppError}>
        <CloseIcon scale={1.3} />
      </Close>
    </div>
  );
};

export const AppErrorBanner = styled(_AppErrorBanner)`
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 1px 3px #0000001c;
  background: ${Theme.red};
  padding: 15px;
  position: relative;
  position: sticky;
  top: 0;
  z-index: 2;
`;
