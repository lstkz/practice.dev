import React from 'react';
import ReactDOM from 'react-dom';
import { Hmr, Registry, startHmr, TypelessContext } from 'typeless';

import { GlobalStyle } from './components/GlobalStyle';

const MOUNT_NODE = document.getElementById('root')!;

const registry = new Registry();

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

render();
