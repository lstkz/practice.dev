import * as React from 'react';
import { LoginPage } from '../pages/LoginPage';
import { useAppState, useAppDispatch } from '../contexts/AppContext';
import { useRouter } from '../contexts/RouterContext';
import { ApiClient } from '../ApiClient';
import { HomePage } from '../pages/HomePage';

export function Router() {
  const { pathname, push } = useRouter();
  const { isLoaded } = useAppState();
  const appDispatch = useAppDispatch();

  React.useEffect(() => {
    if (localStorage.token) {
      ApiClient.getMe()
        .catch(() => null)
        .then(user => {
          appDispatch({ type: 'user-loaded', user });
        });
    } else {
      push('/login');
      appDispatch({ type: 'user-loaded', user: null });
    }
  }, []);

  if (!isLoaded) {
    return null;
  }

  switch (pathname) {
    case '/login': {
      console.log('render LoginPage');
      return <LoginPage />;
    }
    case '/': {
      console.log('render Home');
      return <HomePage />;
    }
    default:
      return <div>not found</div>;
  }
}
