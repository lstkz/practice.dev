import React from 'react';
import * as R from 'remeda';
import { RouteResolver } from './RouteResolver';
import { useGlobalModule } from '../features/global/module';
import { useRouterModule } from '../features/router';
import { getGlobalState } from 'src/features/global/interface';
import { useMappedState } from 'typeless';
import { useGlobalSolutionsModule } from 'src/features/globalSolutions/module';
import { GlobalModals } from './GlobalModals';
import { useLoginModule } from 'src/features/login/module';
import { useRegisterModule } from 'src/features/register/module';
import { useResetPasswordModule } from 'src/features/resetPassword/module';

export function App() {
  useGlobalModule();
  useGlobalSolutionsModule();
  useRouterModule();
  useLoginModule();
  useRegisterModule();
  useResetPasswordModule();

  const { isLoaded } = useMappedState([getGlobalState], R.pick(['isLoaded']));
  if (!isLoaded) {
    return null;
  }
  return (
    <>
      <RouteResolver />
      <GlobalModals />
    </>
  );
}
