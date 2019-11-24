import React from 'react';
import * as R from 'remeda';
import { injectGlobal } from 'emotion';
import { RouteResolver } from './RouteResolver';
import { useGlobalModule } from '../features/global/module';
import { useRouterModule } from '../features/router';
import { getGlobalState } from 'src/features/global/interface';
import { useMappedState } from 'typeless';

injectGlobal`
@import url(https://fonts.googleapis.com/css?family=Nunito+Sans:300,400,600,700);

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
    font-family: 'Nunito Sans', sans-serif;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.7;
    margin: 0;
    text-align: left;
    color: #8492a6;
    background-color: #fff;
    height: 100%;
    display: flex;
    flex-direction: column;
}

#root {
    height: 100%  ;
    display: flex;
    flex-direction: column;
}

[tabindex='-1']:focus
{
    outline: 0 !important;
}

a {
  text-decoration: none;
    color: #0c66ff;
    background-color: transparent;
}

ol, ul, dl {
    margin-top: 0;
    margin-bottom: 16px;
}

h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6 {
    font-family: inherit;
    font-weight: 400;
    line-height: 1.5;
    margin-bottom: .66667rem;
    color: #3c4858;
}

h4, h5, h6, .h4, .h5, .h6 {
    font-weight: 600;
}

h5, .h5 {
    font-size: 1.25rem;
}
input, button, select, optgroup, textarea {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    margin: 0;
}

strong {
  font-weight: 600;
}

small {
  font-size: 80%;
  font-weight: 400;
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
