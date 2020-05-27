import * as React from 'react';
import { WarningIcon } from 'src/icons/WarningIcon';
import { getGlobalState, GlobalActions } from 'src/features/global/interface';
import { useActions } from 'typeless';
import { AppBanner } from './AppBanner';

export function AppErrorBanner() {
  const { appError } = getGlobalState.useState();
  const { hideAppError } = useActions(GlobalActions);
  if (!appError) {
    return null;
  }
  return (
    <AppBanner testId="app-error" type="error" onClose={hideAppError}>
      <WarningIcon color={'white'} scale={1.3} />
      {appError.error}
      {appError.requestId && (
        <>
          <br />
          Request Id: {appError.requestId}
        </>
      )}
    </AppBanner>
  );
}
