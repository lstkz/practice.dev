import * as React from 'react';
import { LoginPage } from './LoginPage';
import { useAppState } from './AppContext';
import { useRouter } from './RouterContext';

export function Router() {
  const { pathname, push } = useRouter();
  const { user } = useAppState();
  console.log({ user, pathname });

  React.useLayoutEffect(() => {
    if (!user && pathname !== '/login') {
      push('/login');
    }
  }, [pathname, user]);

  switch (pathname) {
    case '/login': {
      console.log('render LoginPage');
      return <LoginPage />;
    }
    case '/': {
      console.log('render Home');
      return <div>Home</div>;
    }
    default:
      return <div>not found</div>;
  }
}
