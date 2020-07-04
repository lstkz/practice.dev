import * as React from 'react';
import { LoginPage } from '../pages/LoginPage';
import { useAppState, useAppDispatch } from '../contexts/AppContext';
import { useRouter } from '../contexts/RouterContext';
import { ApiClient } from '../ApiClient';
import { HomePage } from '../pages/HomePage';
import { UsersPage } from '../pages/UsersPage';
import { UserPage } from '../pages/UserPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { ProjectPage } from '../pages/ProjectPage';

export function Router() {
  const { pathname, push } = useRouter();
  const { isLoaded } = useAppState();
  const appDispatch = useAppDispatch();

  React.useEffect(() => {
    if (localStorage.token) {
      ApiClient.getMe()
        .catch(() => null)
        .then(user => {
          if (!user) {
            push('/login');
          }
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
      return <LoginPage />;
    }
    case '/users': {
      return <UsersPage />;
    }
    case '/projects': {
      return <ProjectsPage />;
    }
    case '/': {
      return <HomePage />;
    }
    default:
      if (pathname.startsWith('/users/')) {
        return <UserPage />;
      }
      if (pathname.startsWith('/projects/')) {
        return <ProjectPage />;
      }
      return <div>not found</div>;
  }
}
