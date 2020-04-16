import React from 'react';
import * as R from 'remeda';
import { RouteResolver } from './RouteResolver';
import { useGlobalModule } from '../features/global/module';
import { useRouterModule } from '../features/router';
import { getGlobalState } from 'src/features/global/interface';
import { useMappedState } from 'typeless';
import { useGlobalSolutionsModule } from 'src/features/globalSolutions/module';
import { GlobalModals } from './GlobalModals';

export function App() {
  useGlobalModule();
  useGlobalSolutionsModule();
  useRouterModule();

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
