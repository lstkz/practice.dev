import React from 'react';
import * as R from 'remeda';
import { injectGlobal } from 'emotion';
import { RouteResolver } from './RouteResolver';
import { useGlobalModule } from '../features/global/module';
import { useRouterModule } from '../features/router';
import { getGlobalState } from 'src/features/global/interface';
import { useMappedState } from 'typeless';
import { Theme } from 'src/common/Theme';

injectGlobal`
@import url(https://fonts.googleapis.com/css?family=Roboto:300,400,500,600);

*,
*::before,
*::after
{
    box-sizing: border-box;
}

html
{
    font-family: sans-serif;
    line-height: 1.15;

    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: rgba(31, 45, 61, 0);
    height: 100% !important;
}
body
{
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.7;
    margin: 0;
    text-align: left;
    color: ${Theme.text};
    background-color: white;
    height: 100%;
    display: flex;
    flex-direction: column;
}

#root {
    height: 100% ;
    display: flex;
    flex-direction: column;
}
 

`;

export function App() {
  useGlobalModule();
  useRouterModule();

  const { isLoaded } = useMappedState([getGlobalState], R.pick(['isLoaded']));
  if (!isLoaded) {
    return null;
  }
  return (
    <>
      <RouteResolver />
    </>
  );
}
