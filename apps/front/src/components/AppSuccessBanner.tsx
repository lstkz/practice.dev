import * as React from 'react';
import { getGlobalState, GlobalActions } from 'src/features/global/interface';
import { useActions } from 'typeless';
import { SuccessFilledIcon } from 'src/icons/SuccessFilledIcon';
import { AppBanner } from './AppBanner';

export function AppSuccessBanner() {
  const { appSuccess } = getGlobalState.useState();
  const { hideAppSuccess } = useActions(GlobalActions);
  if (!appSuccess) {
    return null;
  }
  return (
    <AppBanner testId="app-success" type="success" onClose={hideAppSuccess}>
      <SuccessFilledIcon />
      {appSuccess}
    </AppBanner>
  );
}
