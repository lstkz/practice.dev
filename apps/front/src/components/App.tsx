import React from 'react';
import { injectGlobal } from 'emotion';
import { LandingView } from '../features/landing/LandingView';

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
}

[tabindex='-1']:focus
{
    outline: 0 !important;
}

`;

export function App() {
  return (
    <div>
      <LandingView />
    </div>
  );
}
