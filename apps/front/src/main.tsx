import React from 'react';
import ReactDOM from 'react-dom';
import { Hmr, startHmr, TypelessContext } from 'typeless';
import { GlobalStyle } from './components/GlobalStyle';
import { registry } from './registry';

const MOUNT_NODE = document.getElementById('root')!;

(window as any)._registry = registry;
const render = () => {
  const App = require('./components/App').App;
  ReactDOM.unmountComponentAtNode(MOUNT_NODE);
  try {
    ReactDOM.render(
      <Hmr>
        <TypelessContext.Provider value={{ registry }}>
          <>
            <GlobalStyle />
            <App />
          </>
        </TypelessContext.Provider>
      </Hmr>,
      MOUNT_NODE
    );
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.error(e);
    throw e;
  }
};

if (module.hot) {
  module.hot.accept('./components/App', () => {
    startHmr();
    render();
  });
}
if (window.location.pathname === '/github') {
  if (window.opener) {
    const code = /code=(\w+)/.exec(window.location.search)![1];
    (window.opener as any).githubCallback(code);
    window.close();
  }
} else if (window.location.pathname === '/google') {
  if (window.opener) {
    const token = /access_token=([^&]+)/.exec(window.location.hash)![1];
    (window.opener as any).googleCallback(token);
    window.close();
  }
} else {
  render();
}
