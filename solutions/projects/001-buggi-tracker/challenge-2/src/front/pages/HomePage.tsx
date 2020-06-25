import React from 'react';
import { Dashboard } from '../components/Dashboard';
import { Link } from '../components/Link';

export function HomePage() {
  return (
    <Dashboard>
      <div className="home-page">
        {/* <span className="home-page__placeholder" data-test="placeholder">
          home page placeholder
        </span> */}

        <Link className="home-page__card" href="/users">
          Users
        </Link>
      </div>
    </Dashboard>
  );
}
