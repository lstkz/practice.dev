import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
*, ::after, ::before {
    box-sizing: border-box;
}

html, body, #app {
  height: 100%;
}

body {
  background-color: #f5f5f5;
  margin: 0;
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
}

.h1, .h2, .h3, .h4, .h5, .h6, h1, h2, h3, h4, h5, h6 {
    margin-bottom: 8px;
    font-weight: 500;
    line-height: 1.2;
    margin-top: 0;
}

a {
    color: #007bff;
    text-decoration: none;
    background-color: transparent;
}

h5 {
  font-size: 20px;
}

`;
