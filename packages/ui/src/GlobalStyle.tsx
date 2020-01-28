import { createGlobalStyle } from 'styled-components';
import { Theme } from './Theme';

export const GlobalStyle = createGlobalStyle`
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
    background-color: ${Theme.bgLightGray4};
    height: 100%;
    display: flex;
    flex-direction: column;
}

a {
  color: ${Theme.blue};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}

#root {
    height: 100% ;
    display: flex;
    flex-direction: column;
}

`;
