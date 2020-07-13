import React from 'react';
import { useAppState, useAppDispatch } from '../contexts/AppContext';
import { useUser } from '../hooks';
import { useRouter } from '../contexts/RouterContext';

interface DashboardProps {
  children: React.ReactChild;
}

export function Dashboard(props: DashboardProps) {
  const { children } = props;
  const user = useUser();
  const appDispatch = useAppDispatch();
  const { push } = useRouter();
  return (
    <>
      <div className="header">
        <h2 className="header__title">Buggi</h2>
        <div
          data-test-dir="left"
          data-test="header-username"
          className="header__username"
        >
          Hello {user.username}
        </div>
        <button
          onClick={() => {
            appDispatch({ type: 'logout' });
            delete localStorage.token;
            push('/login');
          }}
          data-test="logout-btn"
          className="btn btn-primary"
        >
          Logout
        </button>
      </div>
      {children}
    </>
  );
}