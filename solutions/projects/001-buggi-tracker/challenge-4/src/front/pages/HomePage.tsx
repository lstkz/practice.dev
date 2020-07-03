import React from 'react';
import { Dashboard } from '../components/Dashboard';
import { Link } from '../components/Link';
import { useUser } from '../hooks';

export function HomePage() {
  const user = useUser();
  return (
    <Dashboard>
      <div className="page home-page">
        {user.role === 'admin' && (
          <Link
            data-test="home-card-users"
            data-test-dir="top-center"
            className="home-page__card"
            href="/users"
          >
            Users
          </Link>
        )}
        <Link
          data-test="home-card-projects"
          data-test-dir="top-center"
          className="home-page__card"
          href="/projects"
        >
          Projects
        </Link>
      </div>
    </Dashboard>
  );
}
