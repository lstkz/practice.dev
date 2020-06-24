import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import './styles.css';
import { Router } from './Router';
import { AppProvider } from './AppContext';
import { RouterProvider } from './RouterContext';

function App() {
  return (
    <RouterProvider>
      <AppProvider>
        <Router />
      </AppProvider>
    </RouterProvider>
  );
}

export default hot(App);
